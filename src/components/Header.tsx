import React from "react"
import { Nav, Navbar } from "react-bootstrap"

export const Header: React.FC = () => {
    return(
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="#home">Matt Levine's Insider Trading App</Navbar.Brand>
            <Nav className="mr-auto">
            {/* <Nav.Link href="#about">About</Nav.Link> */}
            </Nav>
        </Navbar>
    )
}
