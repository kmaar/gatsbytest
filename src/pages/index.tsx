import React, { useRef, useState, useEffect } from "react"
import { ThemeWrapper } from '../ThemeWrapper';
import { Button } from "@postidigital/posti-components";
import PreSelectedItemMobileMenu from './mobilemenutest';

const IndexPage = () => {
  return (
    <ThemeWrapper>
      <div style={{ width: '900px', height: '700px', backgroundColor: 'teal' }}>
        <Button>test</Button>
        <PreSelectedItemMobileMenu />
      </div>
    </ThemeWrapper>
  )
}

export default IndexPage

export const Head = () => <title>Home Page</title>
