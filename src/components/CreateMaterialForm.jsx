import { useState } from 'react';
import { createMaterial } from '../services/api';

export default function CreateMaterialForm({
  courseId,
  topics,
  defaultTopicId,
  onCreated
}) {

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [topicId, setTopicId] = useState(defaultTopicId || '');
  const [linkUrl, setLinkUrl] = useState('');
  const [state, setState] = useState('PUBLISHED');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {

    e.preventDefault();

    if (!title.trim()) return;

    setLoading(true);
    setError('');

    try {

      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        topicId: topicId || undefined,
        state,
        materials: linkUrl.trim()
          ? [{ link: { url: linkUrl.trim() } }]
          : []
      };

      await createMaterial(courseId, payload);

      setTitle('');
      setDescription('');
      setLinkUrl('');
      setOpen(false);

      if (onCreated) onCreated();

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full mb-3 p-2 border-2 border-dashed border-purple-500 text-purple-600 rounded-xl hover:bg-purple-50 transition"
      >
        + Nuevo material
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-3 p-3 bg-purple-50 rounded-xl space-y-2"
    >

      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Título del material"
        className="w-full p-2 border rounded-lg"
        autoFocus
      />

      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Descripción (opcional)"
        rows={2}
        className="w-full p-2 border rounded-lg"
      />

      <select
        value={topicId}
        onChange={e => setTopicId(e.target.value)}
        className="w-full p-2 border rounded-lg bg-white"
      >
        <option value="">Sin tema</option>
        {topics.map(t => (
          <option key={t.topicId} value={t.topicId}>
            {t.name}
          </option>
        ))}
      </select>

      <input
        type="url"
        value={linkUrl}
        onChange={e => setLinkUrl(e.target.value)}
        placeholder="Enlace (opcional)"
        className="w-full p-2 border rounded-lg"
      />

      <select
        value={state}
        onChange={e => setState(e.target.value)}
        className="w-full p-2 border rounded-lg bg-white"
      >
        <option value="PUBLISHED">Publicado</option>
        <option value="DRAFT">Borrador</option>
      </select>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="flex gap-2">

        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="flex-1 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Creando…' : 'Crear'}
        </button>

        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError('');
          }}
          className="px-4 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Cancelar
        </button>

      </div>

    </form>
  );
}