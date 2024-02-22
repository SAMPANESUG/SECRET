<template>
    <div class="container">
        <div class="header">
            <h1>취업 관리 시스템</h1>
            <input type="text" v-model="searchQuery" placeholder="학생 검색..." />
        </div>
        <div class="main-content">
            <div class="form-container">
                <div class="input-field">
                    <label>학생 ID:</label>
                    <input v-model="student.studentId" placeholder="학생 ID" />
                </div>
                <div class="input-field">
                    <label>이름:</label>
                    <input v-model="student.name" placeholder="이름" />
                </div>
                <div class="input-field">
                    <label>회사:</label>
                    <input v-model="student.company" placeholder="회사" />
                </div>
                <div class="input-field">
                    <label>취업 날짜:</label>
                    <input type="date" v-model="student.employmentDate" />
                </div>
                <div class="input-field">
                    <label>상태:</label>
                    <select v-model="student.status">
                        <option value="">선택...</option>
                        <option value="지원 중">지원 중</option>
                        <option value="면접 중">면접 중</option>
                        <option value="취업 완료">취업 완료</option>
                    </select>
                </div>
                <button @click="addOrUpdateStudent">{{ isUpdateMode ? '업데이트' : '추가' }}</button>
            </div>
            <div class="list-container">
                <ul>
                    <li v-for="student in filteredStudents" :key="student.id">
                        {{ student.studentId }} - {{ student.name }} - {{ student.company }} - {{ student.employmentDate }}
                        - {{ student.status }}
                        <span>
                            <button @click="selectStudent(student)">수정</button>
                            <button @click="deleteStudent(student.id)">삭제</button>
                        </span>
                    </li>
                </ul>
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
                status: ''
            },
            searchQuery: '',
            isUpdateMode: false,
            updateId: null
        };
    },
    computed: {
        filteredStudents() {
            return this.students.filter(student => {
                return student.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    student.studentId.includes(this.searchQuery);
            });
        }
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
            this.student = { studentId: '', name: '', company: '', employmentDate: '', status: '' };
            this.isUpdateMode = false;
            this.updateId = null;
        }
    }
};
</script>

<style scoped>
.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.header input {
    padding: 10px;
    width: 200px;
}

.main-content {
    display: flex;
    justify-content: space-between;
}

.form-container,
.list-container {
    flex-basis: 48%;
}

.input-field {
    margin-bottom: 10px;
}

.input-field label {
    display: block;
    margin-bottom: 5px;
}

.input-field input,
.input-field select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    padding: 10px 15px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
}

button:hover {
    background-color: #45a049;
}

.list-container ul {
    list-style: none;
    padding: 0;
}

.list-container li {
    padding: 10px;
    background-color: #f9f9f9;
    margin-bottom: 8px;
    border-radius: 4px;
}

.list-container span {
    float: right;
}

.list-container button {
    margin-left: 10px;
}</style>
