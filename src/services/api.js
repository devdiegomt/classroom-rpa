const BASE_URL = 'http://localhost:3000';

export async function getCourses() {

  const response =
    await fetch(`${BASE_URL}/courses`);

  return response.json();
}

export async function getTopics(courseId) {

  const response =
    await fetch(
      `${BASE_URL}/courses/${courseId}/topics`
    );

  return response.json();
}

export async function getCoursework(
  courseId,
  topicId
) {

  const response =
    await fetch(
      `${BASE_URL}/courses/${courseId}/topics/${topicId}/coursework`
    );

  return response.json();
}

export async function getSubmissions(
  courseId,
  courseWorkId
) {

  const response =
    await fetch(
      `${BASE_URL}/courses/${courseId}/coursework/${courseWorkId}/submissions`
    );

  return response.json();
}

export async function getStudents(courseId) {

  const response =
    await fetch(
      `${BASE_URL}/courses/${courseId}/students`
    );

  return response.json();
}