import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())

app.use(express.json())

const notes = []

app.get('/notes', (req, res) => {
	res.json(notes)
})

app.get('/notes/:id', (req, res) => {
	const id = String(req.params.id)
	const targetNote = notes.find(note => String(note.id) === id)

	if (!targetNote) {
		return res.status(404).json({ error: 'Note not found' })
	}

	res.json(targetNote)
})

app.post('/notes', (req, res) => {
	const note = req.body

	if (!note || note.id == null || note.text == null || note.title == null) {
		return res.status(400).json({ error: 'Invalid note content.' })
	}

	if (notes.some(n => String(n.id) === String(note.id))) {
		return res.status(409).json({ error: 'Note with this id already exists' })
	}

	notes.push({
		id: note.id,
		title: note.title,
		text: note.text,
		createdAt: new Date().toISOString(),
	})

	return res.status(201).json({
		note: {
			id: note.id,
			title: note.title,
			text: note.text,
			createdAt: new Date().toISOString(),
		},
	})
})

app.put('/notes/:id', (req, res) => {
	const id = String(req.params.id)
	const { text, title } = req.body

	if (text == null && title == null) {
		return res.status(400).json({ error: 'Invalid payload' })
	}

	const index = notes.findIndex(n => String(n.id) === id)
	if (index === -1) {
		return res.status(404).json({ error: 'Note not found' })
	}

	if (text != null) notes[index].text = text
	if (title != null) notes[index].title = title
	notes[index].updatedAt = new Date().toISOString()
	return res.json({ note: notes[index] })
})

app.delete('/notes/:id', (req, res) => {
	const id = String(req.params.id)
	const index = notes.findIndex(n => String(n.id) === id)

	if (index === -1) {
		return res.status(404).json({ error: 'Note not found' })
	}

	notes.splice(index, 1)
	return res.status(200).json({ message: 'Note deleted successfully' })
})

app.listen(process.env.PORT || 3000, () => {
	console.log('Server is running on port 3000')
})
