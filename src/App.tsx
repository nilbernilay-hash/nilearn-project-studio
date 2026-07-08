import { useEffect, useState } from 'react'
import { Tldraw, getSnapshot, loadSnapshot, type Editor } from 'tldraw'
import 'tldraw/tldraw.css'
import { supabase } from './lib/supabase'

const BOARD_ID = 'main'

function App() {
	const [editor, setEditor] = useState<Editor | null>(null)

	// Load Board once on startup
	useEffect(() => {
		if (!editor) return

		async function loadBoard() {
			console.log('Loading board from Supabase...')

			const { data, error } = await supabase
				.from('"page 1"')
				.select('data')
				.eq('id', BOARD_ID)
				.maybeSingle()

			console.log('Load result:', { data, error })

			// TypeScript safety check: Ensure editor exists before accessing store
			if (data?.data && editor) {
				loadSnapshot(editor.store, data.data)
			}
		}

		loadBoard()
	}, [editor])

	// Force Save every 5 seconds
	useEffect(() => {
		if (!editor) return

		const saveBoard = async () => {
			console.log('Attempting to save...')

			// TypeScript safety check: Ensure editor exists before getting snapshot
			if (!editor) return
			
			const snapshot = getSnapshot(editor.store)

			const { error } = await supabase
				.from('"page 1"')
				.upsert({
					id: BOARD_ID,
					data: snapshot,
					updated_at: new Date().toISOString(),
				})

			if (error) {
				console.error('SAVE ERROR:', error)
			} else {
				console.log('SAVE SUCCESS')
			}
		}

		const interval = setInterval(saveBoard, 5000)
		return () => clearInterval(interval)
	}, [editor])

	return (
		<div style={{ position: 'fixed', inset: 0 }}>
			<Tldraw
				licenseKey={import.meta.env.VITE_TLDRAW_LICENSE_KEY}
				onMount={(editor) => setEditor(editor)}
			/>
		</div>
	)
}

export default App
