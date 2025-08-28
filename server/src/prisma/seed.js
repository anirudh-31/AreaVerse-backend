import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const neighborhoods = [
        { name: 'Indiranagar', city: 'Bengaluru', state: 'Karnataka', country: 'India' },
        { name: 'Koramangala', city: 'Bengaluru', state: 'Karnataka', country: 'India' },
        { name: 'Rajarajeshwari Nagar', city: 'Bengaluru', state: 'Karnataka', country: 'India' },
        { name: 'Powai', city: 'Mumbai', state: 'Maharashtra', country: 'India' },
        { name: 'Bandra', city: 'Mumbai', state: 'Maharashtra', country: 'India' },
        { name: 'Whitefield', city: 'Bengaluru', state: 'Karnataka', country: 'India' },
        { name: 'Andheri West', city: 'Mumbai', state: 'Maharashtra', country: 'India' },
        { name: 'Hauz Khas', city: 'Delhi', state: 'Delhi', country: 'India' },
        { name: 'Connaught Place', city: 'Delhi', state: 'Delhi', country: 'India' },
    ]

    for (const n of neighborhoods) {
        await prisma.neighborhood.upsert({
            where: { name: n.name },
            update: {},
            create: n,
        })
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
