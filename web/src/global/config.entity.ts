import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({schema: 'biosDB', name: 'config'})
export class Config {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: "server_name"
  })
  server_name: string;

	@Column({
    length: 15,
    comment: "server_ip"
  })
  server_ip: string;

	@Column({
		
	})
	server_port: number;

  @Column({
    length: 255,
    comment: "server_des"
  })
  server_des: string;
	
}