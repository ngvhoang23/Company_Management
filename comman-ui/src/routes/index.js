import DefaultLayout from '~/Layouts/DefaultLayout/DefaultLayout';
import AddRequest from '~/pages/AddRequest/AddRequest';
import AddCalendar from '~/pages/AddCalendar/AddCalendar';
import AddEmployee from '~/pages/AddEmployee/AddEmployee';
import AddPost from '~/pages/AddPost/AddPost';
import Calendar from '~/pages/Calendar/Calendar';
import CalendarEditor from '~/pages/CalendarEditor/CalendarEditor';
import Documents from '~/pages/Documents/Documents';
import EmployeeEditor from '~/pages/EmployeeEditor/EmployeeEditor';
import Employees from '~/pages/Employees/Employees';
import Home from '~/pages/Posts/Posts';
import LogIn from '~/pages/LogIn/LogIn';
import PostEditor from '~/pages/PostEditor/PostEditor';
import Profile from '~/pages/Profile/Profile';
import ProfileEditor from '~/pages/ProfileEditor/ProfileEditor';
import RequestEditor from '~/pages/RequestEditor/RequestEditor';
import SentRequests from '~/pages/SentRequests/SentRequests';
import ArrivalRequests from '~/pages/ArrivalRequests/ArrivalRequests';
import CalendarRequest from '~/pages/CalendarRequest/CalendarRequest';
import SentCalendarRequests from '~/pages/SentCalendarRequests/SentCalendarRequests';
import CalendarRequestEditor from '~/pages/CalendarRequestEditor/CalendarRequestEditor';
import CompanyStructure from '~/pages/CompanyStructure/CompanyStructure';
import AddDocument from '~/pages/AddDocument/AddDocument';

const publicRoutes = [
    { path: '/company-structure', component: CompanyStructure, layout: DefaultLayout },
    { path: '/', component: Home, layout: DefaultLayout },
    { path: '/posts', component: Home, layout: DefaultLayout },
    { path: '/posts/add-post', component: AddPost, layout: DefaultLayout },
    { path: '/posts/edit-post', component: PostEditor, layout: DefaultLayout },
    { path: '/posts/edit-post/:postId', component: PostEditor, layout: DefaultLayout },
    { path: '/login', component: LogIn, layout: null },
    { path: '/documents', component: Documents, layout: DefaultLayout },
    { path: '/documents/add-document', component: AddDocument, layout: DefaultLayout },
    { path: '/profile', component: Profile, layout: DefaultLayout },
    { path: '/profile/:user_id', component: Profile, layout: DefaultLayout },
    { path: '/profile/edit-profile', component: ProfileEditor, layout: DefaultLayout },
    { path: '/calendars', component: Calendar, layout: DefaultLayout },
    { path: '/calendars/requests', component: CalendarRequest, layout: DefaultLayout },
    { path: '/calendars/sent-requests', component: SentCalendarRequests, layout: DefaultLayout },
    { path: '/calendars/add-calendar', component: AddCalendar, layout: DefaultLayout },
    { path: '/calendars/edit-calendar/:calId', component: CalendarEditor, layout: DefaultLayout },
    { path: '/calendars/edit-calendar-request/:calId', component: CalendarRequestEditor, layout: DefaultLayout },
    { path: '/calendars/edit-calendar-request/', component: CalendarRequestEditor, layout: DefaultLayout },
    { path: '/calendars/edit-calendar/', component: CalendarEditor, layout: DefaultLayout },
    { path: '/employees', component: Employees, layout: DefaultLayout },
    { path: '/employees/add-employee', component: AddEmployee, layout: DefaultLayout },
    { path: '/employees/edit-employee/:empId', component: EmployeeEditor, layout: DefaultLayout },
    { path: '/employees/edit-employee/', component: EmployeeEditor, layout: DefaultLayout },
    { path: '/requests/sent-requests', component: SentRequests, layout: DefaultLayout },
    { path: '/requests/arrival-requests', component: ArrivalRequests, layout: DefaultLayout },
    { path: '/requests/add-request', component: AddRequest, layout: DefaultLayout },
    { path: '/requests/edit-request/:reqId', component: RequestEditor, layout: DefaultLayout },
    { path: '/requests/edit-request/', component: RequestEditor, layout: DefaultLayout },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
