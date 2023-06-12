import Role from '../models/Role';

export const createRoles = async () => {
  try {
    const count = await Role.estimatedDocumentCount()
    if(count > 0) return;

    const values = await Promise.all([
      new Role({ name: 'user' }).save(),
      new Role({ name: 'admin' }).save()
    ])
    console.log('Initial roles created:')
    console.log(values)
    console.log('---> Roles created')
  } catch (error) {
    console.error(error)
  }
}