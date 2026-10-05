import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, RelationId } from 'typeorm';
import { Student } from '../../students/entities/student.entity.js';
import { Course } from '../../courses/entities/course.entity.js';

@Entity('enrollments')
    export class Enrollment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Student, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'studentId' })
    student: Student;

    @RelationId((enrollment: Enrollment) => enrollment.student)
    studentId: number;

    @ManyToOne(() => Course, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'courseId' })
    course: Course;

    @RelationId((enrollment: Enrollment) => enrollment.course)
    courseId: number;
}