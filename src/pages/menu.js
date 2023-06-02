import lightpaperpdf from '../assets/docs/OnitBuddy-LightPaper.pdf'

const menus = [
    {
        id: 1,
        name: 'Home',
        link: '',
        namesub: null
    },
    {
        id: 2,
        name: 'The Collection',
        link: 'collection',
        namesub: null
    },{
        id: 3,
        name: 'The Project',
        link:"project",
        namesub: [
            {
                id: 1,
                sub: 'Project Overview',
                download: false,
                links: '/#project'
            },
            {
                id: 2,
                sub: 'Read the Lightpaper',
                download: true,
                links: ''
            },
            {
                id: 3,
                sub: 'Join us on GitHub',
                download: false,
                external: true,
                links: 'https://github.com/onitbuddy/transmorgprotocol'
            }
        ],
    },
    {
        id: 4,
        name: 'Roadmap',
        link: 'roadmap',
        namesub: null
    },
    {
        id: 5,
        name: 'Team',
        link: 'team',
        namesub: null
    },
    {
        id: 7,
        name: 'Resources',
        namesub: [
            {
                id: 1,
                sub: 'Join the DAO',
                download: false,
                external: true,
                links: 'https://discord.gg/RWs3DP2'
            },
            {
                id: 2,
                sub: 'Read the Lightpaper',
                download: true,
                links: {lightpaperpdf}
            },
            {
                id: 3,
                sub: 'Design System',
                download: false,
                external: true,
                links: 'https://github.com/onitbuddy/OnitDesignSystem'
            },
            {
                id: 4,
                sub: 'NFTT Project',
                download: false,
                external: true,
                links: 'https://github.com/onitbuddy/NFTT'
            },
        ],
    },
    
]

export default menus;