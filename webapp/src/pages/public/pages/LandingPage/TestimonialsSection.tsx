import {Avatar, Box, Container, Typography} from "@material-ui/core";
import Client1 from "../../../../images/testimonials/happy_client_1.jpg";
import Client2 from "../../../../images/testimonials/happy_client_2.png";
import Client3 from "../../../../images/testimonials/happy_client_3.jpg";
import * as React from "react";

export default function TestimonialsSection() {
  return (
    <Container maxWidth="md">
      <Box sx={{display: 'flex', alignItems: 'center', my: 5, flexWrap: 'wrap',}}>
        <Box sx={{paddingRight: 5}}>
          <div className="user">
            <Avatar alt="Remy Sharp" src={Client1} sx={{width: 200, height: 200,}}/>
          </div>
        </Box>

        <Box sx={{width: 600}}>
          <Typography variant="subtitle1" sx={{fontStyle: 'italic',}}>« C'est l'une des meilleures applications de running que j'ai téléchargées. Cela permet de s'éclipser un petit peu de la vie réelle tout en faisant du sport ! »</Typography>
          <Typography variant="subtitle2" sx={{fontStyle: 'italic', marginLeft: 20}}>- Adrien Dudon</Typography>
        </Box>
      </Box>

      <Box sx={{display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', my: 5, flexWrap: 'wrap',}}>
        <Box sx={{paddingRight: 5}}>
          <div className="user">
            <Avatar alt="Remy Sharp" src={Client2} sx={{width: 200, height: 200,}}/>
          </div>
        </Box>

        <Box sx={{width: 600}}>
          <Typography variant="subtitle1" sx={{fontStyle: 'italic',}}>« J'adore Run4Exp. Au départ, je n'aimais pas trop faire du sport. Mais la façon dont l'application nous incite à courir est très ludique, j'ai perdu du poids grâce à elle. »</Typography>
          <Typography variant="subtitle2" sx={{fontStyle: 'italic', marginLeft: 20}}>- Ilya Ukhanov</Typography>
        </Box>
      </Box>

      <Box sx={{display: 'flex', alignItems: 'center', my: 5, flexWrap: 'wrap',}}>
        <Box sx={{paddingRight: 5}}>
          <div className="user">
            <Avatar alt="Remy Sharp" src={Client3} sx={{width: 200, height: 200,}}/>
          </div>
        </Box>

        <Box sx={{width: 600}}>
          <Typography variant="subtitle1" sx={{fontStyle: 'italic',}}>« Habitué des applications de running, j'ai essayé Run4Exp. Elle est très différente des autres applications, de plus, le fait que cela soit une application faite par une start-up française est un atout ! »</Typography>
          <Typography variant="subtitle2" sx={{fontStyle: 'italic', marginLeft: 20}}>- Anonyme</Typography>
        </Box>
      </Box>
    </Container>
  )
}