

interface Button {
  clickFunction: ()=>{};
  text?: string;
  img?: string;
  altText?: string;
  buttonStylingClass: string;
}

export function PrimaryBtn({clickFunction, text, buttonStylingClass}: Button){
    return(
        <button className={buttonStylingClass} onClick={clickFunction}>{text} 
        </button>
    )
}

export function IconBtn({clickFunction, img, altText, buttonStylingClass}: Button){
    return(
        <button className={buttonStylingClass} onClick={clickFunction}><img src={img} alt={altText} /> 
        </button>
    )
}
