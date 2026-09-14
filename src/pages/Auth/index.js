import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import axios from '../../lib/axios'
import { MySwal } from '../../lib/swal'
import { waiting } from '../../assets';

const Auth = () => {
    const { token } = useParams();

    const [loading, setloading] = useState(false)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    const checkToken = () => {
        setloading(true)
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        const requestBody = {}

        axios.post(`/users/checkToken`, requestBody, config)
            .then(res => {
                // alert(res.data.data.id)
                if (res.status === 200) {
                    localStorage.setItem('id', res.data.data.id);
                    localStorage.setItem('email', res.data.data.email);
                    localStorage.setItem('fullname', res.data.data.fullname);
                    localStorage.setItem('nik', res.data.data.nik);
                    localStorage.setItem('token', token);
                    setTimeout(() => {
                        setloading(false)
                        window.location.href = '/home'
                    }, 3000);
                } else {
                    setloading(false)
                    MySwal.fire({
                        icon: 'error',
                        title: 'Ooops, Error!',
                        text: 'Unauthorized',
                    })
                    setTimeout(() => {
                        localStorage.clear()
                        window.location.reload()
                    }, 3000);
                }
            })
            .catch(err => {
                if (err !== "") {
                    console.log(err?.response?.data)
                    MySwal.fire({
                        icon: 'info',
                        title: 'Info',
                        text: `${err?.response?.data?.message}`,
                    })
                }
            });
    }

    useEffect(() => {
        checkToken()
        window.addEventListener('resize', () => setWindowWidth(window.innerWidth))
        return () => window.removeEventListener('resize', () => setWindowWidth(window.innerWidth))
    })

    return (
        <div style={{ backgroundColor: 'white', height: '900px' }}>
            {
                loading === true ?
                    <>
                        <div className='d-flex justify-content-center' style={{ marginTop: '200px' }}>
                            <img src={waiting} alt='waiting' style={{ width: windowWidth < 810 ? '65%' : '30%' }} />
                        </div>
                        <div className='d-flex justify-content-center m-3'>
                            {
                                windowWidth < 810 ?
                                    <h5 style={{ fontStyle: 'Montserrat' }}>Please wait a moment,<br /> We will redirect you to Schedule System.</h5>
                                    :
                                    <h2 style={{ fontStyle: 'Montserrat' }}>Please wait a moment,<br /> We will redirect you to Schedule System.</h2>
                            }

                        </div>
                    </>
                    :
                    ''
            }
        </div>
    )
}

export default Auth
