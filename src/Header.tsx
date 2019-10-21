import React from "react"
import { Navbar, Nav } from 'react-bootstrap'


export const Header: React.FC = () => {
    return(
        <>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="#home">Stox</Navbar.Brand>
                <Nav className="mr-auto">
                <Nav.Link href="#about">About</Nav.Link>
                </Nav>
            </Navbar>
            </>
    )
} 