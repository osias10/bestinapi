import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({schema: 'biosDB', name: 'user'})
@Unique(["dong", "ho", "email"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: "동"
  })
  dong: string;

  @Column({
    length: 50,
    comment: "호수"
  })
  ho: string;

  @Column()
  password: string;
  
  @Column({unique: true})
  public email: string;

  @Column()
  public name: string;
  
  @Column({
    length: 25
  })
  tel: string;

  @Column()
  ip: string;

  @Column({
    default: 0,
    comment: "사용자 활성화 상태 0: 비활성화, 1: 활성화"
  })
  status: number;

  @Column({
    comment: "계정 만료일",
    type: 'datetime',
    default: () => 'now()'
  })
  expire_date: Date;

  @CreateDateColumn({
    comment: "가입일",
    type: 'datetime',
    default: () => 'now()'
  })
  rdate: Date;

}

export default User;