import img1 from '../images/projectdescripton/opensourcedesignsystem.png';
//import img2 from '../images/slider/slide_1.png';
import imgbg1 from '../images/slider/bg_slide_12.png'
//import imgbg2 from '../images/slider/bg_slide_12.png'

interface Slidedata {
    title_1?: String; 
    title_2?: String; 
    title_3?: String; 
    description?: String; 
    img?: String; 
    imgbg?: String
}


const heroSliderData:Slidedata []= [
    {
        title_1: "The World's First",
        title_2: "Creative Open Source",
        title_3: "NFTT Project",
        description: " design system, OnitBuddy is open to contributions from creators all over the world. New content will be made available to holders of the OnitBuddy Transmorg Collection via the transmorg system, enabling an ever evolving ecosystem of original and uniquely customizable Non-Fungable-Transmorgaphable-Tokens (NFTT).",
        img: img1,
        imgbg: imgbg1
    }
]

export default heroSliderData;