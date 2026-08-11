import { useState } from 'react';
import { createTopic } from '../services/api';

export default function CreateTopicForm({ courseId, onCreated }) {

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {

    e.preventDefault();

    if (!name.trim()) return;

    setLoading(true);
    setError('');

    try {

      await createTopic(courseId, name.trim());

      setName('');
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
        className="w-full mb-3 p-2 border-2 border-dashed border-blue-500 text-blue-600 rounded-xl hover:bg-blue-50 transition"
      >
        + Nuevo tema
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-3 p-3 bg-blue-50 rounded-xl space-y-2"
    >

      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Nombre del tema"
        className="w-full p-2 border rounded-lg"
        autoFocus
      />

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="flex gap-2">

        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="flex-1 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creando…' : 'Crear'}
        </button>

        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setName('');
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