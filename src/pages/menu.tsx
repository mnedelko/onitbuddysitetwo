//@ts-ignore
import lightpaperpdf from '../../assets/docs/OnitBuddy-LightPaper.pdf'

const daolink = 'https://discord.gg/RWs3DP2';

interface Namesub {
    id: number;
    sub: String;
    download: boolean;
    external?: boolean,
    links: String;
}

interface MenueStructList {
    id: number;
    name: String;
    link?: String;
    namesub?: Namesub[] | any 
}

const menus: MenueStructList[] = [
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
                links: '/home-05#project'
            },
            {
                id: 2,
                sub: 'Read the Lightpaper',
                download: true,
                links: {lightpaperpdf}
            },
            {
                id: 3,
                sub: 'Join us on GitHub',
                download: false,
                external: true,
                links: 'https://github.com/onitbuddy/transmorgprotocol'
            },
            {
                id: 4,
                sub: 'Mint',
                download: false,
                links: '/item-details-02'
            },
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
                links: null
            },
            {
                id: 2,
                sub: 'Light Paper',
                download: false,
                links: '/contact-02'
            },
            {
                id: 2,
                sub: 'Design System',
                download: false,
                links: '/contact-02'
            },
            {
                id: 2,
                sub: 'NFTT Project',
                download: false,
                links: '/contact-02'
            },
        ],
    },
    
]

export default menus;