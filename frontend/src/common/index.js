const backUrl = 'http://localhost:3001'

const SummaryApi = {

    auth:{
        register: {
            url: `${backUrl}/api/auth/register`,
            method: 'post',
        },
        login: {
            url: `${backUrl}/api/auth/login`,
            method: 'post',
        },
        verify: {
            url: `${backUrl}/api/auth/verify`,
            method: 'post',
        },
        admin_login: {
            url: `${backUrl}/api/admin/login`,
            method: 'post',
        },
        reset: {
            url: `${backUrl}/api/auth/reset`,
            method: 'post',
        },
    },
    banners:{
        post:`${backUrl}/api/banners`,
        get:`${backUrl}/api/banners`,
        put:`${backUrl}/api/banners/`,
        delete:`${backUrl}/api/banners/`
    },
    carts:{
        url:`${backUrl}/api/carts`,
        put:`${backUrl}/api/carts/`,
        delete:`${backUrl}/api/carts/`,
        buy:{
            path:`${backUrl}/api/carts/buy`,
            method:'post',
        },
        
    },
    categories:{
        post:`${backUrl}/api/categories`,
        get:`${backUrl}/api/categories`,
        get_by_id:`${backUrl}/api/categories/`,
        put:`${backUrl}/api/categories/`,
        delete:`${backUrl}/api/categories/`
    },
    contacts:{
        get:`${backUrl}/api/contacts`,
        post:`${backUrl}/api/contacts`
    },
    events:{
        get:`${backUrl}/api/events`,
        post:`${backUrl}/api/events`,
        get_by_id:`${backUrl}/api/events/`,
        put:`${backUrl}/api/events/`,
        delete:`${backUrl}/api/events/`,
        add_to_cart:{
            url:`${backUrl}/api/events/`,
            end:`/add-to-cart`,
            method:'post'
        },
        add_to_favorite:{
            url:`${backUrl}/api/events/`,
            end:`/add-to-favorite`,
            method:'post'
        }
    },
    favorites:{
        get:`${backUrl}/api/favorites`,
        delete:`${backUrl}/api/favorites/`,
    },
    places:{
        post:`${backUrl}/api/places`,
        get:`${backUrl}/api/places`,
        put:`${backUrl}/api/places/`,
        delete:`${backUrl}/api/places/`,
    },
    search:{
        url:`${backUrl}/api/search`,
        method:'get',
    },
    testimonials:{
        post:`${backUrl}/api/testimonials`,
        get:`${backUrl}/api/testimonials`,
        put:`${backUrl}/api/testimonials/`,
        delete:`${backUrl}/api/testimonials/`,
    },
    users:{
        post:`${backUrl}/api/users`,
        get:`${backUrl}/api/users`,
        get_by_id:`${backUrl}/api/users/`,
        put:`${backUrl}/api/users/`,
        delete:`${backUrl}/api/users/`,
    },
    loadImg:{
        url:`${backUrl}/api/loadImg/`,
    }
    
}

export { SummaryApi };