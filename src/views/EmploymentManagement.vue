<template>
    <div class="container py-4">
        <h1 class="mb-4 text-center">취업 관리 시스템</h1>
        <div class="mb-3">
            <input v-model="student.studentId" class="form-control mb-2" placeholder="학생 ID" disabled="disabled" />
            <input v-model="student.name" class="form-control mb-2" placeholder="이름" />
            <input v-model="student.company" class="form-control mb-2" placeholder="회사" />
            <input type="date" v-model="student.employmentDate" class="form-control mb-2" placeholder="취업 날짜" />
            <button @click="addOrUpdateStudent" class="btn btn-primary btn-block">학생 추가/수정</button>
            <button v-if="isUpdateMode" @click="resetForm" class="btn btn-warning btn-block">취소</button>
        </div>
        <div class="table-responsive">
            <table class="table table-hover">
                <thead class="thead-light">
                    <tr>
                        <th scope="col">학생 ID</th>
                        <th scope="col">이름</th>
                        <th scope="col">회사</th>
                        <th scope="col">취업 날짜</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="student in students" :key="student.id">
                        <td>{{ student.studentId }}</td>
                        <td>{{ student.name }}</td>
                        <td>{{ student.company }}</td>
                        <td>{{ student.employmentDate }}</td>
                        <td>
                            <button @click="selectStudent(student)" class="btn btn-secondary btn-sm">수정</button>
                            <button @click="deleteStudent(student.id)" class="btn btn-danger btn-sm">삭제</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export default {
    data() {
        return {
            students: [],
            student: {
                studentId: '',
                name: '',
                company: '',
                employmentDate: '',
            },
            isUpdateMode: false,
            updateId: null,
        };
    },
    async created() {
        await this.fetchStudents();
    },
    methods: {
        async fetchStudents() {
            const querySnapshot = await getDocs(collection(db, 'students'));
            this.students = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },
        async addOrUpdateStudent() {
            if (this.isUpdateMode) {
                const studentRef = doc(db, 'students', this.updateId);
                await updateDoc(studentRef, this.student);
            } else {
                await addDoc(collection(db, 'students'), this.student);
            }
            this.resetForm();
            await this.fetchStudents();
        },
        async deleteStudent(id) {
            await deleteDoc(doc(db, 'students', id));
            await this.fetchStudents();
        },
        selectStudent(student) {
            this.student = { ...student };
            this.isUpdateMode = true;
            this.updateId = student.id;
        },
        resetForm() {
            this.student = { studentId: '', name: '', company: '', employmentDate: '' };
            this.isUpdateMode = false;
            this.updateId = null;
        },
    },
};
</script>

<style>
.employment-management {
    max-width: 800px;
    margin: 20px auto;
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.student-form input,
.student-form button {
    margin-top: 10px;
}

.table-hover tbody tr:hover {
    background-color: #f0f0f0;
}

.text-center {
    text-align: center;
}

.btn-block {
    display: block;
    width: 100%;
    margin-bottom: 10px;
}
</style>
