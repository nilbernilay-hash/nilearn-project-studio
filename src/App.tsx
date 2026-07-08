import { useEffect, useState } from 'react'
import { Tldraw, getSnapshot, loadSnapshot, type Editor } from 'tldraw'
import 'tldraw/tldraw.css'
import { supabase } from './lib/supabase'

const BOARD_ID = 'main'

function App() {
	const [editor, setEditor] = useState<Editor | null>(null)
	const [loaded, setLoaded] = useState(false)

	useEffect(() => {
		if (!editor) return

		async function loadBoard() {
			console.log('Loading board from Supabase...')

			const { data, error } = await supabase
				.from('boards')
				.select('data')
				.eq('id', BOARD_ID)
				.maybeSingle()

			console.log('Load result:', { data, error })

			if (data?.data) {
				loadSnapshot(editor.store, data.data)
			}

			setLoaded(true)
		}

		loadBoard()
	}, [editor])

	useEffect(() => {
		if (!editor || !loaded) return

		const saveBoard = async () => {
			console.log('Saving board to Supabase...')

			const snapshot = getSnapshot(editor.store)

			const { error } = await supabase.from('boards').upsert({
				id: BOARD_ID,
				data: snapshot,
				updated_at: new Date().toISOString(),
			})

			console.log('Save result:', error)
		}

		const interval = setInterval(saveBoard, 5000)

		return () => {
			clearInterval(interval)
		}
	}, [editor, loaded])

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
