import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('courses')
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    level: string;

    @Column({
        type: 'integer',
        nullable: true,
    })
    createdByUserId: number | null;
}