import { db, Role, User, Product, ProductImage } from 'astro:db';
import { v4 as uuid} from 'uuid';
import bcrypt from 'bcryptjs';
import { seedProducts } from './seed-data';

// https://astro.build/db/seed
export default async function seed() {
	
	const roles = [
		{ id: 'admin', name: 'Administrador' },
		{ id: 'user', name: 'Usuario de sistema' }
	]

	const johnDoe = {
		id: 'ABC-JOHN-123',  //uuid(),
		name: 'John Doe',
		email: 'john.doe@google.com',
		password: bcrypt.hashSync('123456'),
		role: 'admin'
	}

	const janeDoe = {
		id: 'ABC-JANE-123',  //uuid(),
		name: 'Jane Doe',
		email: 'jane.doe@google.com',
		password: bcrypt.hashSync('123456'),
		role: 'user'
	}

	await db.insert(Role).values(roles)
	await db.insert(User).values([johnDoe, janeDoe])

	const queries: any = []

	seedProducts.forEach(async product => {
		const p = {
			id: uuid(),
			stock: product.stock,
			price: product.price,
			sizes: product.sizes.join(','),
			type: product.type,
			tags: product.tags.join(','),
			title: product.title,
			description: product.description,
			gender: product.gender,
			user: johnDoe.id,
			slug: product.slug
		}

		queries.push(db.insert(Product).values(p))

		product.images.forEach(async image => {
			const pi = {
				id: uuid(),
				productId: p.id,
				image
			}
			queries.push(db.insert(ProductImage).values(pi))
		})
	})

	await db.batch(queries);

}
