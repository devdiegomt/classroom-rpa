export async function createTopic(courseId, name) {

  const response =
    await fetch(
      `${BASE_URL}/courses/${courseId}/topics`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      }
    );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Error creando tema');
  }

  return response.json();
}

export async function createMaterial(courseId, payload) {

  const response =
    await fetch(
      `${BASE_URL}/courses/${courseId}/materials`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Error creando material');
  }

  return response.json();
}

export async function createCoursework(courseId, payload) {

  const response =
    await fetch(
      `${BASE_URL}/courses/${courseId}/coursework`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Error creando tarea');
  }

  return response.json();
}