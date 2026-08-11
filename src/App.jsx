import { useEffect, useState } from 'react';

import {
  getCourses,
  getTopics,
  getCoursework,
  getSubmissions,
  getStudents
} from './services/api';

import CreateTopicForm from './components/CreateTopicForm';
import CreateMaterialForm from './components/CreateMaterialForm';
import CreateCourseworkForm from './components/CreateCourseworkForm';

export default function App() {

  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState([]);
  const [coursework, setCoursework] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedCourse, setSelectedCourse] =
    useState(null);

  const [selectedTopic, setSelectedTopic] =
    useState(null);

  const [selectedWork, setSelectedWork] =
    useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {

    async function loadCourses() {

      try {

        const data = await getCourses();

        setCourses(data);

      } catch (error) {

        console.error(error);
      }
    }

    loadCourses();

  }, []);

  async function handleCourse(courseId) {

    try {

      setSelectedCourse(courseId);

      const data = await getTopics(courseId);

      const studentsData = await getStudents(courseId);

      setStudents(studentsData);

      setTopics(data);

      setCoursework([]);
      setSubmissions([]);

    } catch (error) {

      console.error(error);
    }
  }

  async function handleTopic(topicId) {

    try {

      setSelectedTopic(topicId);

      const data =
        await getCoursework(
          selectedCourse,
          topicId
        );

      setCoursework(data);

      setSubmissions([]);

    } catch (error) {

      console.error(error);
    }
  }

  async function handleCoursework(work) {

    console.log('WORK:', work);

    try {

      setSelectedWork(work);

      const data =
        await getSubmissions(
          selectedCourse,
          work.id
        );

      setSubmissions(data);

    } catch (error) {

      console.error(error);
    }
  }

  async function handleDownloadEverything(work) {

    if (!selectedCourse || !work) {
      return;
    }

    try {

      const url =
        `${API_URL}/courses/${selectedCourse}/coursework/${work.id}/download-all`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();

      const downloadUrl =
        window.URL.createObjectURL(blob);

      const a = document.createElement('a');

      a.href = downloadUrl;

      a.download =
        `${work.title}.zip`;

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(downloadUrl);

    } catch (error) {

      console.error(error);
    }
  }

  async function reloadTopics() {

    if (!selectedCourse) return;

    try {

      const data = await getTopics(selectedCourse);

      setTopics(data);

    } catch (error) {

      console.error(error);
    }
  }

  async function reloadCoursework() {

    if (!selectedCourse || !selectedTopic) return;

    try {

      const data =
        await getCoursework(
          selectedCourse,
          selectedTopic
        );

      setCoursework(data);

    } catch (error) {

      console.error(error);
    }
  }

  function getStudentName(userId) {

    const student =
      students.find(
        s => s.userId === userId
      );

    return student
      ? student.name
      : userId;
  }

  return (

    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Classroom RPA
          </h1>

          <p className="text-gray-600 mt-2">
            Descarga y administración de tareas de Google Classroom
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">

          {/* COURSES */}

          <div className="bg-white p-5 rounded-2xl shadow">

            <h2 className="text-2xl font-semibold mb-5">
              Cursos
            </h2>

            <div className="space-y-3">

              {courses.map(course => (

                <button
                  key={course.id}
                  onClick={() =>
                    handleCourse(course.id)
                  }
                  className={`
                    w-full
                    text-left
                    p-3
                    rounded-xl
                    transition
                    text-white
                    ${selectedCourse === course.id
                      ? 'bg-black'
                      : 'bg-gray-700 hover:bg-black'
                    }
                  `}
                >
                  <p className="font-semibold">
                    {course.name}
                  </p>

                  <p className="text-sm opacity-80">
                    {course.section}
                  </p>
                </button>

              ))}

            </div>
          </div>

          {/* TOPICS */}

          <div className="bg-white p-5 rounded-2xl shadow">

            <h2 className="text-2xl font-semibold mb-5">
              Topics
            </h2>

            {selectedCourse && (
              <CreateTopicForm
                courseId={selectedCourse}
                onCreated={reloadTopics}
              />
            )}

            <div className="space-y-3">

              {topics.map(topic => (

                <button
                  key={topic.topicId}
                  onClick={() =>
                    handleTopic(topic.topicId)
                  }
                  className={`
                    w-full
                    text-left
                    p-3
                    rounded-xl
                    transition
                    text-white
                    ${selectedTopic === topic.topicId
                      ? 'bg-blue-700'
                      : 'bg-blue-500 hover:bg-blue-700'
                    }
                  `}
                >
                  {topic.name}
                </button>

              ))}

            </div>
          </div>

          {/* COURSEWORK */}

          <div className="bg-white p-5 rounded-2xl shadow">

            <h2 className="text-2xl font-semibold mb-5">
              Coursework
            </h2>

            {selectedCourse && (
              <>
                <CreateCourseworkForm
                  courseId={selectedCourse}
                  topics={topics}
                  defaultTopicId={selectedTopic}
                  onCreated={reloadCoursework}
                />

                <CreateMaterialForm
                  courseId={selectedCourse}
                  topics={topics}
                  defaultTopicId={selectedTopic}
                  onCreated={reloadCoursework}
                />
              </>
            )}

            <div className="space-y-4">

              {coursework.map(work => (

                <div
                  key={work.id}
                  className="bg-gray-100 p-4 rounded-2xl"
                >

                  <button
                    onClick={() =>
                      handleCoursework(work)
                    }
                    className={`
                      w-full
                      text-left
                      p-3
                      rounded-xl
                      transition
                      text-white
                      ${selectedWork?.id === work.id
                        ? 'bg-green-800'
                        : 'bg-green-600 hover:bg-green-800'
                      }
                    `}
                  >
                    <p className="font-semibold">
                      {work.title}
                    </p>

                    <p className="text-sm opacity-80">
                      {work.workType}
                    </p>
                  </button>

                  <button
                    onClick={() =>
                      handleDownloadEverything(work)
                    }
                  >
                    Download Everything
                  </button>

                </div>

              ))}

            </div>
          </div>

          {/* SUBMISSIONS */}

          <div className="bg-white p-5 rounded-2xl shadow">

            <h2 className="text-2xl font-semibold mb-5">
              Submissions
            </h2>

            <div className="space-y-4">

              {submissions.map(submission => (

                <div
                  key={submission.submissionId}
                  className="bg-gray-100 p-4 rounded-2xl"
                >

                  <div className="flex items-center justify-between mb-3">

                    <span className="
                      bg-black
                      text-white
                      px-3
                      py-1
                      rounded-full
                      text-sm
                    ">
                      {submission.state}
                    </span>

                    <span className="text-sm text-gray-500">
                      Attachments:
                      {' '}
                      {submission.attachments?.length || 0}
                    </span>

                  </div>

                  <p className="text-sm text-gray-700 break-all">
                    User ID:
                    {' '}
                    {getStudentName(submission.userId)}
                  </p>

                  {
                    submission.attachments?.length > 0 && (

                      <div className="mt-3 space-y-2">

                        {
                          submission.attachments.map(
                            (attachment, index) => {

                              const file =
                                attachment.driveFile;

                              if (!file) return null;

                              return (

                                <div
                                  key={index}
                                  className="
                                    bg-white
                                    p-2
                                    rounded-xl
                                    border
                                  "
                                >
                                  <p className="text-sm font-medium">
                                    {file.title}
                                  </p>
                                </div>
                              );
                            }
                          )
                        }

                      </div>
                    )
                  }

                </div>

              ))}

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}