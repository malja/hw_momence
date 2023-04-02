import arrow from "../../assets/arrow.png";
import styled from "styled-components";

const Div = styled.div`
  display: flex;
  gap: 20px;
  align-items: end;
  margin: 2em 0 2em 0;
`

const Span = styled.span`
  font-size: 1.2em;
  font-style: italic;
  position: relative;
  bottom: -10px;
`

const Image = styled.img`
  width: 40%;
`

export function Pointer() {
  return (
    <Div>
      <Span>That's where the 🦄 magic 🦄 happens!</Span>
      <Image src={arrow} />
    </Div>
  )
}
