import axios from 'axios';
import { showAlert } from '../utils/alert';
import { clearWindow } from '../views/windowView';

export default class Classroom {
  constructor() {}

  async getClassroom(role, token) {
    try {
      const path =
        role === 'student' ? 'student-classrooms' : 'teacher-classrooms';

      const url = `https://polar-savannah-53668.herokuapp.com/api/v0/users/${path}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.data.classroom;
    } catch (err) {
      const { message } = err.response.data;
      showAlert('error', message);
    }
  }

  async getStudents(token) {
    try {
      const res = await axios.get(
        `https://polar-savannah-53668.herokuapp.com/api/v0/users/students`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data.data.user;
    } catch (err) {
      const { message } = err.response.data;
      showAlert('error', message);
    }
  }

  async createClassroom(name, students, deck, teacher, token) {
    try {
      const res = await axios.post(
        `https://polar-savannah-53668.herokuapp.com/api/v0/classrooms/`,
        {
          name,
          teacher,
          deck,
          students,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status === 'success') {
        showAlert('success', 'Classroom was created');
      }
    } catch (err) {
      const { message } = err.response.data;
      showAlert('error', message);
    }
  }

  async updateClassroom(classroomId, name, students, deck, token) {
    try {
      const res = await axios.patch(
        `https://polar-savannah-53668.herokuapp.com/api/v0/classrooms/${classroomId}`,
        {
          name,
          deck,
          students,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status === 'success') {
        showAlert('success', 'Classroom was updated');
      }
    } catch (err) {
      const { message } = err.response.data;
      showAlert('error', message);
    }
  }

  async deleteClassroom(classroomId, token) {
    try {
      const res = await axios.delete(
        `https://polar-savannah-53668.herokuapp.com/api/v0/classrooms/${classroomId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 204) {
        clearWindow();
        showAlert('success', 'Classroom was deleted');
      }
    } catch (err) {
      const { message } = err.response.data;
      showAlert('error', message);
    }
  }
}
