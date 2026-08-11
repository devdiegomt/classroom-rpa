import { useState } from 'react';
import { createCoursework } from '../services/api';

export default function CreateCourseworkForm({
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
  const [workType, setWorkType] = useState('ASSIGNMENT');
  const [state, setState] = useState('PUBLISHED');
  const [maxPoints, setMaxPoints] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
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
        workType,
        state,
        materials: linkUrl.trim()
          ? [{ link: { url: linkUrl.trim() } }]
          : []
      };

      if (maxPoints) {
        payload.maxPoints = Number(maxPoints);
      }

      if (dueDate) {

        const timePart = dueTime || '23:59';
        const dt = new Date(`${dueDate}T${timePart}`);

        payload.dueDate = {
          year: dt.getUTCFullYear(),
          month: dt.getUTCMonth() + 1,
          day: dt.getUTCDate()
        };

        payload.dueTime = {
          hours: dt.getUTCHours(),
          minutes: dt.getUTCMinutes()
        };
      }

      await createCoursework(courseId, payload);

      setTitle('');
      setDescription('');
      setLinkUrl('');
      setMaxPoints('');
      setDueDate('');
      setDueTime('');
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
        className="w-full mb-3 p-2 border-2 border-dashed border-green-600 text-green-700 rounded-xl hover:bg-green-50 transition"
      >
        + Nueva tarea
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-3 p-3 bg-green-50 rounded-xl space-y-2"
    >

      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Título de la tarea"
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
        value={workType}
        onChange={e => setWorkType(e.target.value)}
        className="w-full p-2 border rounded-lg bg-white"
      >
        <option value="ASSIGNMENT">Tarea</option>
        <option value="SHORT_ANSWER_QUESTION">Pregunta corta</option>
        <option value="MULTIPLE_CHOICE_QUESTION">Opción múltiple</option>
      </select>

      <input
        type="number"
        value={maxPoints}
        onChange={e => setMaxPoints(e.target.value)}
        placeholder="Puntos máximos (opcional)"
        min="0"
        className="w-full p-2 border rounded-lg"
      />

      <div className="grid grid-cols-2 gap-2">

        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          className="p-2 border rounded-lg"
        />

        <input
          type="time"
          value={dueTime}
          onChange={e => setDueTime(e.target.value)}
          className="p-2 border rounded-lg"
          disabled={!dueDate}
        />

      </div>

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
          className="flex-1 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
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