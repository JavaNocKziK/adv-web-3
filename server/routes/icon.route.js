const express = require('express');
const router = express.Router();

router.route('/:icon/:colour')
    .get((req, res) => {
        res.type('image/svg+xml');
        let icon = (icons[req.params.icon] || icons['default']);
        res.send(icon.replace('#', `#${req.params.colour}`));
    });

const icons = {
    default: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#" d="M9.29,21H12.12L21,12.12V9.29M19,21C19.55,21 20.05,20.78 20.41,20.41C20.78,20.05 21,19.55 21,19V17L17,21M5,3A2,2 0 0,0 3,5V7L7,3M11.88,3L3,11.88V14.71L14.71,3M19.5,3.08L3.08,19.5C3.17,19.85 3.35,20.16 3.59,20.41C3.84,20.65 4.15,20.83 4.5,20.92L20.93,4.5C20.74,3.8 20.2,3.26 19.5,3.08Z" /></svg>',
    check: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M0 0h48v48H0z" fill="none"/><path fill="#" d="M18 32.34L9.66 24l-2.83 2.83L18 38l24-24-2.83-2.83z"/></svg>',
    back: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M0 0h48v48H0z" fill="none"/><path fill="#" d="M40 22H15.66l11.17-11.17L24 8 8 24l16 16 2.83-2.83L15.66 26H40v-4z"/></svg>',
    refresh: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#" d="M35.3 12.7C32.41 9.8 28.42 8 24 8 15.16 8 8.02 15.16 8.02 24S15.16 40 24 40c7.45 0 13.69-5.1 15.46-12H35.3c-1.65 4.66-6.07 8-11.3 8-6.63 0-12-5.37-12-12s5.37-12 12-12c3.31 0 6.28 1.38 8.45 3.55L26 22h14V8l-4.7 4.7z"/><path d="M0 0h48v48H0z" fill="none"/></svg>',
    close: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#" d="M38 12.83L35.17 10 24 21.17 12.83 10 10 12.83 21.17 24 10 35.17 12.83 38 24 26.83 35.17 38 38 35.17 26.83 24z"/><path d="M0 0h48v48H0z" fill="none"/></svg>',
    list: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#" d="M14,10H2V12H14V10M14,6H2V8H14V6M2,16H10V14H2V16M21.5,11.5L23,13L16,20L11.5,15.5L13,14L16,17L21.5,11.5Z" /></svg>',
    listnew: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#" d="M2,16H10V14H2M18,14V10H16V14H12V16H16V20H18V16H22V14M14,6H2V8H14M14,10H2V12H14V10Z" /></svg>',
    user: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" /></svg>',
    userprofile: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#" d="M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,12.9 12,12.9C14,12.9 17.97,14 18,16C16.71,17.92 14.5,19.2 12,19.2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z" /></svg>',
    plus: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#" d="M38 26H26v12h-4V26H10v-4h12V10h4v12h12v4z"/><path d="M0 0h48v48H0z" fill="none"/></svg>',
    minus: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#" d="M19,13H5V11H19V13Z" /></svg>',
    toggleon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#" d="M7,7A5,5 0 0,1 12,12A5,5 0 0,1 7,17A5,5 0 0,1 2,12A5,5 0 0,1 7,7M20,14H14V10H20A2,2 0 0,1 22,12A2,2 0 0,1 20,14M7,9A3,3 0 0,0 4,12A3,3 0 0,0 7,15A3,3 0 0,0 10,12A3,3 0 0,0 7,9Z" /></svg>',
    toggleoff: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#" d="M17,7A5,5 0 0,1 22,12A5,5 0 0,1 17,17A5,5 0 0,1 12,12A5,5 0 0,1 17,7M4,14A2,2 0 0,1 2,12A2,2 0 0,1 4,10H10V14H4Z" /></svg>',
    cookingpot: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#000000" d="M19,19A2,2 0 0,1 17,21H7A2,2 0 0,1 5,19V13H3V10H14L18,3.07L19.73,4.07L16.31,10H21V13H19V19Z"/></svg>',
    edit: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#000000" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>'
}

module.exports = router;
