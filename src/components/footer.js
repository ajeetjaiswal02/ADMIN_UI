import React from 'react'

function footer() {
    return (
        <div>
            <span dangerouslySetInnerHTML={{ "__html": "&copy;" }} />
            <span>2021</span>
            <p src="https://www.geektrust.in/coding-problem/frontend/adminui">https://www.geektrust.in/coding-problem/frontend/adminui</p>
        </div>
    )
}

export default footer