import Cookies from 'js-cookie';

const role = Cookies.get('role');
console.log(role);
Cookies.remove('sessionid', { path: '/', domain: '127.0.0.1' });
Cookies.remove('csrftoken', { path: '/', domain: '127.0.0.1' });
