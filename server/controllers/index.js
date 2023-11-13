//File Name: index.js, Student Name: Aqeish Parvez, Student ID: 301225795, Web App Name: COMP229-MIDTERM-301225795

export function DisplayHomePage(req, res, next) {
    res.render('index', { title: 'Home', page: 'home' });
}