import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'

function App() {
	return (
		<div style={{ position: 'fixed', inset: 0 }}>
			<Tldraw
				licenseKey="tldraw-2026-10-16/WyJnVWNsYS03MCIsWyIqIl0sMTYsIjIwMjYtMTAtMTYiXQ.8Jf1JNtQxadcXBJ2i7xA6NOvPxzi5L3JQ8IQxwEvuPJpC/zzQu8QPbNfFG3KbiLVdD4W/ZDP5rxW/NEWbbFXiA"
			/>
		</div>
	)
}

export default App
