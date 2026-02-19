// types.d.ts

export type UserRole = 'admin' | 'user'

export interface User {
	id: string
	name: string
	email: string
	role: UserRole
	password_hash: string
	created_at?: string // ISO timestamp
}

export interface Book {
	id: string
	title: string
	author: string
	category?: string
	total_copies: number
	created_at?: string // ISO timestamp
}

export type RentalStatus = 'rented' | 'returned'

export interface Rental {
	id: string
	userId: string
	bookId: string
	status: RentalStatus
	start_date?: string // ISO timestamp
	end_date?: string // ISO timestamp
}

export type PaymentStatus = 'pending' | 'completed' | 'failed'

export interface Payment {
	id: string
	rental_id: string
	status: PaymentStatus
	amount: number
	created_at?: string // ISO timestamp
}
