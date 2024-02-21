<template>
    <div class="container">
        <h1>취업 관리 시스템</h1>
        <div class="form">
            <input v-model="student.studentId" placeholder="학생 ID" />
            <input v-model="student.name" placeholder="이름" />
            <input v-model="student.company" placeholder="회사" />
            <input type="date" v-model="student.employmentDate" />
            <button @click="addOrUpdateStudent">{{ isUpdateMode ? '업데이트' : '추가' }}</button>
        </div>
        <div class="list">
            <div v-for="student in students" :key="student.id" class="list-item">
                <div>{{ student.studentId }}</div>
                <div>{{ student.name }}</div>
                <div>{{ student.company }}</div>
                <div>{{ student.employmentDate }}</div>
                <button @click="selectStudent(student)">수정</button>
                <button @click="deleteStudent(student.id)">삭제</button>
            </div>
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
                await updateDoc(doc(db, 'students', this.updateId), this.student);
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

<style scoped>
.container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

h1 {
    text-align: center;
    margin-bottom: 20px;
}

.form input[type="date"],
.form input[type="text"],
.form button {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border-radius: 5px;
    border: 1px solid #ccc;
}

.form button {
    background-color: #4CAF50;
    color: white;
    cursor: pointer;
}

.form button:hover {
    opacity: 0.9;
}

.list {
    margin-top: 20px;
}

.list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    margin-bottom: 10px;
    background-color: #f9f9f9;
    border-radius: 5px;
}

.list-item>div {
    margin: 0 10px;
}

.list-item>button {
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.list-item>button:first-of-type {
    background-color: #ffc107;
}

.list-item>button:last-of-type {
    background-color: #f44336;
    color: white;
}

.list-item>button:hover {
    opacity: 0.8;
}
</style>
