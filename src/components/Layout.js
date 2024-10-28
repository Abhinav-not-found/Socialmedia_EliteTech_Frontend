import React from 'react'
import Sidebar from '../components/Sidebar'

const Layout = ({children}) => {
    return (
        <div className='flex'>
            <Sidebar/>
            {children}
        </div>
    )
}

export default Layout
