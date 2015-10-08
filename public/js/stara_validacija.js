function validateAndSubmit(formName, showHideDiv, textElem)
			
{
	//$(".submitterCont .submitter.submit").removeAttr('onclick');
	$(".submitterCont .submitter").css("cursor", "not-allowed");
    $(".submitterCont .submitter").addClass("disabledbutton");
	
	var forma = document.forms[formName];
	var ele = document.getElementsByName(showHideDiv)[0];
	var text = document.getElementsByName(textElem)[0];
	
	
	
	if ($("#infoPanel").css("display") == "block")
	{
		text.parentElement.className = ""
		
	}
	else
	{
        $("#infoPanel").slideDown(400);
	}
	text.innerHTML = "Validacija";
	var iZaGif = document.createElement("i");
	iZaGif.id =  "loadingGif";
	iZaGif.className = "icon-spinner icon-spin icon-fa anIcoSpin2";
	ele.childNodes[1].childNodes[1].appendChild(iZaGif);
	//divZaGif.style.backgroundImage = "url(grafickiElementi/ajax-loader.gif)";

	var re = /^\d{1,2}\-\d{1,2}\-\d{4}$/;
	setTimeout (function()
	{
		if (forma["ime"].value == "")
		{
			if (!javiGresku("Niste upisali ime!", text)) 
			{	
				forma["ime"].focus();
				return false;
			}
		}
		if (forma["prezime"].value == "" )
		{
			if (!javiGresku("Niste upisali prezime!", text)) 
			{
				forma["prezime"].focus();
				return false;
			}
		}
		
		if (forma["email"].value == "" )
		{
			if (!javiGresku("Niste upisali e-mail adresu!", text)) 
			{
				forma["email"].focus();
				return false;
			}
		}
		else
		{
			var atpos = forma["email"].value.indexOf("@");
			var dotpos = forma["email"].value.lastIndexOf(".");
			if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= forma["email"].value.length)
			{
				if (!javiGresku("Neispravna e-mail adresa!", text)) 
				{
					forma["email"].focus();
					return false;
				}
			  
			}
		}




		/* sve provjere su prošle!*/
		setTimeout(function()
		{
		
			text.innerHTML = "Validacija uspjela!";

            ele.childNodes[1].childNodes[1].removeChild(iZaGif);

			
			forma.submit();
			
		}, 500);

	}, 1000);

}

function validateAndSubmitForUser(formName, showHideDiv, textElem)

{
    //$(".submitterCont .submitter").removeAttr('onclick');
    $(".submitterCont .submitter").css("cursor", "not-allowed");
    $(".submitterCont .submitter").addClass("disabledbutton");

    var forma = document.forms[formName];
    var ele = document.getElementsByName(showHideDiv)[0];
    var text = document.getElementsByName(textElem)[0];



    if ($("#infoPanel").css("display") == "block")
    {
        text.parentElement.className = "";
    }
    else
    {
        $("#infoPanel").slideDown(800);
    }

    text.innerHTML = "Validacija";
    var iZaGif = document.createElement("i");
    iZaGif.id =  "loadingGif";
    iZaGif.className = "icon-spinner icon-spin icon-fa anIcoSpin2";
    ele.childNodes[1].childNodes[1].appendChild(iZaGif);
    //divZaGif.style.backgroundImage = "url(grafickiElementi/ajax-loader.gif)";


    var re = /^\d{1,2}\-\d{1,2}\-\d{4}$/;
    setTimeout (function()
    {
        if (forma["ime"].value == "")
        {
            if (!javiGreskuUsera("Niste upisali ime!", text))
            {
                forma["ime"].focus();
                return false;
            }
        }
        if (forma["prezime"].value == "" )
        {
            if (!javiGreskuUsera("Niste upisali prezime!", text))
            {
                forma["prezime"].focus();
                return false;
            }
        }

        if (forma["email"].value == "" )
        {
            if (!javiGreskuUsera("Niste upisali e-mail adresu!", text))
            {
                forma["email"].focus();
                return false;
            }
        }
        else
        {
            var atpos = forma["email"].value.indexOf("@");
            var dotpos = forma["email"].value.lastIndexOf(".");
            if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= forma["email"].value.length)
            {
                if (!javiGreskuUsera("Neispravna e-mail adresa!", text))
                {
                    forma["email"].focus();
                    return false;
                }

            }
        }

        var termini = document.getElementsByName("odabraniTermini[]");

        if (termini.length == 1 && termini[0].value == "-")
        {
            if (!javiGreskuUsera("Niste odabrali datum treninga!", text))
            {
                return false;
            }
        }
        else
        {

            var brojKredita = $("#brojKredita").html();

            if(termini.length - 1 > brojKredita)
            {
                if (!javiGreskuUsera("Nemate dovoljno kredita (" + brojKredita.toString() + ") za " +
                    "rezervaciju odabranog broja termina (" + (termini.length - 1).toString() + ")!", text))
                {
                    return false;
                }
            }
            for (var i = 0; i < termini.length - 1; i++)
            {
                var termin = termini[i].value;



                var d = parseInt(termin.split(" ")[0].split("-")[2]);
                var m = parseInt(termin.split(" ")[0].split("-")[1]);
                var g = parseInt(termin.split(" ")[0].split("-")[0]);
                //alert(" DAN: " + d + ", MJESEC: " + m + ", GODINA: " + g);

                var td = new Date();
                var danas = new Date();
                var rokRezervacije = new Date();


                rokRezervacije.setHours(danas.getHours()+ 24 );




                td.setFullYear(g, m-1, d);
                td.setHours(parseInt(termin.split(" ")[1].split(":")[0]));
                td.setMinutes(parseInt(termin.split(" ")[1].split(":")[1]));

                if (td < danas)
                {
                    if (!javiGreskuUsera("Odabrani termin treninga " + d + ". " + m + ". " + g + ". " +
                        termin.split(" ")[1] + " je završen!", text))
                    {

                        return false;
                    }
                }

                if (td < rokRezervacije)
                {
                    if (!javiGreskuUsera("Odabrani termin treninga " + d + ". " + m + ". " + g + ". " +
                        termin.split(" ")[1] + " je za manje od " + 24 + "h!", text))
                    {

                        return false;
                    }
                }
            }
        }



        /* sve provjere su prošle!*/

        setTimeout(function()
        {
            text.innerHTML = "Validacija uspjela!";

            ele.childNodes[1].childNodes[1].removeChild(iZaGif);


            forma.submit();

        }, 500);

    }, 1000);

}



function submitPreRegistration(formName, showHideDiv, textElem)

{
    //$(".submitterCont .submitter").removeAttr('onclick');
    $(".submitterCont .submitter").css("cursor", "not-allowed");
    $(".submitterCont .submitter").addClass("disabledbutton");

    var forma = document.forms[formName];
    var ele = document.getElementsByName(showHideDiv)[0];
    var text = document.getElementsByName(textElem)[0];



    if ($("#infoPanel").css("display") == "block")
    {
        text.parentElement.className = "";
    }
    else
    {
        $("#infoPanel").slideDown(500);
    }

    text.innerHTML = "Validacija";
    var iZaGif = document.createElement("i");
    iZaGif.id =  "loadingGif";
    iZaGif.className = "icon-spinner icon-spin icon-fa anIcoSpin2";
    ele.childNodes[1].childNodes[1].appendChild(iZaGif);
    //divZaGif.style.backgroundImage = "url(grafickiElementi/ajax-loader.gif)";


    setTimeout (function()
    {

        var odabirOpcijePredbiljezbe = document.getElementsByName("odabraniTipPredbiljezbe");
        var slobodniTermini = document.getElementsByName("odabraniTerminiRez[]");
        var zauzetiTermini = document.getElementsByName("odabraniTerminiPredb[]");

        var brojKredita = $("#brojKredita").html();


        if (odabirOpcijePredbiljezbe[0].value == 1)
        {
            if(slobodniTermini.length + zauzetiTermini.length > brojKredita)
            {
                if (!javiGreskuUsera("Nemate dovoljno kredita (" + brojKredita.toString() + ") za " +
                    "rezervaciju i predbilježbu odabranog broja termina (" +
                    (slobodniTermini.length + zauzetiTermini.length).toString() + ")!", text))
                {
                    return false;
                }
            }
            for (var i = 0; i < slobodniTermini.length; i++)
            {
                var termin = slobodniTermini[i].value;



                var d = parseInt(termin.split(" ")[0].split("-")[2]);
                var m = parseInt(termin.split(" ")[0].split("-")[1]);
                var g = parseInt(termin.split(" ")[0].split("-")[0]);
                //alert(" DAN: " + d + ", MJESEC: " + m + ", GODINA: " + g);

                var td = new Date();
                var danas = new Date();
                var rokRezervacije = new Date();


                rokRezervacije.setHours(danas.getHours()+ 24 );




                td.setFullYear(g, m-1, d);
                td.setHours(parseInt(termin.split(" ")[1].split(":")[0]));
                td.setMinutes(parseInt(termin.split(" ")[1].split(":")[1]));

                if (td < danas)
                {
                    if (!javiGreskuUsera("Odabrani termin treninga " + d + ". " + m + ". " + g + ". " +
                        termin.split(" ")[1] + " je završen!", text))
                    {

                        return false;
                    }
                }

                if (td < rokRezervacije)
                {
                    if (!javiGreskuUsera("Odabrani termin treninga " + d + ". " + m + ". " + g + ". " +
                        termin.split(" ")[1] + " je za manje od " + 24 + "h!", text))
                    {

                        return false;
                    }
                }
            }
            for (var i = 0; i < zauzetiTermini.length; i++)
            {
                var termin = zauzetiTermini[i].value;



                var d = parseInt(termin.split(" ")[0].split("-")[2]);
                var m = parseInt(termin.split(" ")[0].split("-")[1]);
                var g = parseInt(termin.split(" ")[0].split("-")[0]);
                //alert(" DAN: " + d + ", MJESEC: " + m + ", GODINA: " + g);

                var td = new Date();
                var danas = new Date();
                var rokRezervacije = new Date();


                rokRezervacije.setHours(danas.getHours()+ 24 );




                td.setFullYear(g, m-1, d);
                td.setHours(parseInt(termin.split(" ")[1].split(":")[0]));
                td.setMinutes(parseInt(termin.split(" ")[1].split(":")[1]));

                if (td < danas)
                {
                    if (!javiGreskuUsera("Odabrani termin treninga " + d + ". " + m + ". " + g + ". " +
                        termin.split(" ")[1] + " je završen!", text))
                    {

                        return false;
                    }
                }

                if (td < rokRezervacije)
                {
                    if (!javiGreskuUsera("Odabrani termin treninga " + d + ". " + m + ". " + g + ". " +
                        termin.split(" ")[1] + " je za manje od " + 24 + "h!", text))
                    {

                        return false;
                    }
                }
            }

        }
        else if(odabirOpcijePredbiljezbe[0].value == 2)
        {
            if(slobodniTermini.length > brojKredita)
            {
                if (!javiGreskuUsera("Nemate dovoljno kredita (" + brojKredita.toString() + ") za " +
                    "rezervaciju odabranog broja termina (" + (slobodniTermini.length).toString() + ")!", text))
                {
                    return false;
                }
            }
            for (var i = 0; i < slobodniTermini.length; i++)
            {
                var termin = slobodniTermini[i].value;



                var d = parseInt(termin.split(" ")[0].split("-")[2]);
                var m = parseInt(termin.split(" ")[0].split("-")[1]);
                var g = parseInt(termin.split(" ")[0].split("-")[0]);
                //alert(" DAN: " + d + ", MJESEC: " + m + ", GODINA: " + g);

                var td = new Date();
                var danas = new Date();
                var rokRezervacije = new Date();


                rokRezervacije.setHours(danas.getHours()+ 24 );




                td.setFullYear(g, m-1, d);
                td.setHours(parseInt(termin.split(" ")[1].split(":")[0]));
                td.setMinutes(parseInt(termin.split(" ")[1].split(":")[1]));

                if (td < danas)
                {
                    if (!javiGreskuUsera("Odabrani termin treninga " + d + ". " + m + ". " + g + ". " +
                        termin.split(" ")[1] + " je završen!", text))
                    {

                        return false;
                    }
                }

                if (td < rokRezervacije)
                {
                    if (!javiGreskuUsera("Odabrani termin treninga " + d + ". " + m + ". " + g + ". " +
                        termin.split(" ")[1] + " je za manje od " + 24 + "h!", text))
                    {

                        return false;
                    }
                }
            }

        }
        else
        {
            if (!javiGreskuUseraZaPredb("Neispravan odabir opcije rezervacije!", text))
            {
                return false;
            }
        }

        /* sve provjere su prošle!*/

        setTimeout(function()
        {
            text.innerHTML = "Validacija uspjela!";

            ele.childNodes[1].childNodes[1].removeChild(iZaGif);


            forma.submit();

        }, 500);



    }, 700);

}




function validateAndSubmitLogin(formName, showHideDiv, textElem)

{
    //$(".submitterCont .submitter").removeAttr('onclick');
    $(".submitterCont .submitter").css("cursor", "not-allowed");
    $(".submitterCont .submitter").addClass("disabledbutton");

    var forma = document.forms[formName];
    var ele = document.getElementsByName(showHideDiv)[0];
    var text = document.getElementsByName(textElem)[0];


    if ($("#infoPanel").css("display") == "block")
    {
        text.parentElement.className = "";
    }
    else
    {
        $("#infoPanel").slideDown(400);
    }


    text.innerHTML = "Validacija";

    var iZaGif = document.createElement("i");
    iZaGif.id =  "loadingGif";
    iZaGif.className = "icon-spinner icon-spin icon-fa anIcoSpin2";
    ele.childNodes[1].childNodes[1].appendChild(iZaGif);


    var re = /^\d{1,2}\-\d{1,2}\-\d{4}$/;
    setTimeout (function()
    {
        if (forma["sifra"].value == "")
        {
            if (!javiGreskuLogina("Niste upisali šifru!", text))
            {
                forma["sifra"].focus();
                return false;
            }
        }

        if (forma["email"].value == "" )
        {
            if (!javiGreskuLogina("Niste upisali e-mail adresu!", text))
            {
                forma["email"].focus();
                return false;
            }
        }
        else
        {
            var atpos = forma["email"].value.indexOf("@");
            var dotpos = forma["email"].value.lastIndexOf(".");
            if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= forma["email"].value.length)
            {
                if (!javiGreskuLogina("Neispravna e-mail adresa!", text))
                {
                    forma["email"].focus();
                    return false;
                }

            }
        }


        forma.submit();





    }, 500);

}




function validateAndSubmitPasswordResetEmailEntry(formName, showHideDiv, textElem)

{
    //$(".submitterCont .submitter").removeAttr('onclick');
    $(".submitterCont .submitter").css("cursor", "not-allowed");
    $(".submitterCont .submitter").addClass("disabledbutton");

    var forma = document.forms[formName];
    var ele = document.getElementsByName(showHideDiv)[0];
    var text = document.getElementsByName(textElem)[0];


    if ($("#infoPanel").css("display") == "block")
    {
        text.parentElement.className = "";
    }
    else
    {
        $("#infoPanel").slideDown(400);
    }
    text.innerHTML = "Validacija";

    var iZaGif = document.createElement("i");
    iZaGif.id =  "loadingGif";
    iZaGif.className = "icon-spinner icon-spin icon-fa anIcoSpin2";
    ele.childNodes[1].childNodes[1].appendChild(iZaGif);


    var re = /^\d{1,2}\-\d{1,2}\-\d{4}$/;
    setTimeout (function()
    {

        if (forma["email"].value == "" )
        {
            if (!javiGreskuUnosaMailaZaResetLozinke("Niste upisali e-mail adresu!", text))
            {
                forma["email"].focus();
                return false;
            }
        }
        else
        {
            var atpos = forma["email"].value.indexOf("@");

            var dotpos = forma["email"].value.lastIndexOf(".");
            if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= forma["email"].value.length)
            {
                if (!javiGreskuUnosaMailaZaResetLozinke("Neispravna e-mail adresa!", text))
                {
                    forma["email"].focus();
                    return false;
                }

            }
        }

        forma.submit();

    }, 400);

}



function validateAndSubmitPasswdChange(formName, showHideDiv, textElem)
{
    //$(".submitterCont .submitter").removeAttr('onclick');
    $(".submitterCont .submitter").css("cursor", "not-allowed");
    $(".submitterCont .submitter").addClass("disabledbutton");

    var forma = document.forms[formName];
    var ele = document.getElementsByName(showHideDiv)[0];
    var text = document.getElementsByName(textElem)[0];



    if ($("#infoPanel").css("display") == "block")
    {
        text.parentElement.className = "";
    }
    else
    {
        $("#infoPanel").slideDown(400);
    }
    text.innerHTML = "Validacija";

    var iZaGif = document.createElement("i");
    iZaGif.id =  "loadingGif";
    iZaGif.className = "icon-spinner icon-spin icon-fa anIcoSpin2";
    ele.childNodes[1].childNodes[1].appendChild(iZaGif);


    var re = /^\d{1,2}\-\d{1,2}\-\d{4}$/;
    setTimeout (function()
    {
        if (forma["sifra"].value == "")
        {
            if (!javiGreskuPromjeneLozinke("Niste upisali staru lozinku!", text))
            {
                forma["sifra"].focus();
                return false;
            }
        }

        if (forma["novaSifra1"].value == "")
        {
            if (!javiGreskuPromjeneLozinke("Niste upisali novu lozinku!", text))
            {
                forma["novaSifra1"].focus();
                return false;
            }
        }

        if (forma["novaSifra2"].value == "")
        {
            if (!javiGreskuPromjeneLozinke("Niste ponovili novu lozinku!", text))
            {
                forma["novaSifra2"].focus();
                return false;
            }
        }

        if (forma["novaSifra2"].value != forma["novaSifra1"].value)
        {
            if (!javiGreskuPromjeneLozinke("Lozinke se ne poklapaju!", text))
            {
                forma["novaSifra2"].focus();
                return false;
            }
        }



        forma.submit();


    }, 500);

}



function validateAndSubmitPasswdReset(formName, showHideDiv, textElem)
{
    //$(".submitterCont .submitter").removeAttr('onclick');
    $(".submitterCont .submitter").css("cursor", "not-allowed");
    $(".submitterCont .submitter").addClass("disabledbutton");

    var forma = document.forms[formName];
    var ele = document.getElementsByName(showHideDiv)[0];
    var text = document.getElementsByName(textElem)[0];



    if ($("#infoPanel").css("display") == "block")
    {
        text.parentElement.className = "";
    }
    else
    {
        $("#infoPanel").slideDown(400);
    }
    text.innerHTML = "Validacija";

    var iZaGif = document.createElement("i");
    iZaGif.id =  "loadingGif";
    iZaGif.className = "icon-spinner icon-spin icon-fa anIcoSpin2";
    ele.childNodes[1].childNodes[1].appendChild(iZaGif);


    var re = /^\d{1,2}\-\d{1,2}\-\d{4}$/;
    setTimeout (function()
    {

        if (forma["novaSifra1"].value == "")
        {
            if (!javiGreskuUnosaNoveLozinke("Niste upisali novu lozinku!", text))
            {
                forma["novaSifra1"].focus();
                return false;
            }
        }

        if (forma["novaSifra2"].value == "")
        {
            if (!javiGreskuUnosaNoveLozinke("Niste ponovili novu lozinku!", text))
            {
                forma["novaSifra2"].focus();
                return false;
            }
        }

        if (forma["novaSifra2"].value != forma["novaSifra1"].value)
        {
            if (!javiGreskuUnosaNoveLozinke("Lozinke se ne poklapaju!", text))
            {
                forma["novaSifra2"].focus();
                return false;
            }
        }


        forma.submit();


    }, 500);

}

function javiGreskuUsera(greska, text)
{

    text.parentElement.className = "error-msg";
	text.innerText = greska;
	
	
	var divZaGif = document.getElementById("loadingGif");
	divZaGif.parentNode.removeChild(divZaGif);
	
	
	setTimeout(function()
	{
		//$(".submitterCont .submitter").attr("onclick", onclick="validateAndSubmitForUser('rezervacijaTermina', 'informacije', 'infoText')");
		$(".submitterCont .submitter").css("cursor", "pointer");
        $(".submitterCont .submitter").removeClass("disabledbutton");
		//$(".objava.info").fadeToggle("slow", "linear");
	}, 500);

	
	return false;
}

function javiGreskuUseraZaPredb(greska, text)
{

    text.parentElement.className = "error-msg";
    text.innerText = greska;


    var divZaGif = document.getElementById("loadingGif");
    divZaGif.parentNode.removeChild(divZaGif);


    setTimeout(function()
    {
        //$(".submitterCont .submitter").attr("onclick", onclick="submitPreRegistration('predbiljezbaRezervacijeTermina', 'informacije', 'infoText')");
        $(".submitterCont .submitter").css("cursor", "pointer");
        $(".submitterCont .submitter").removeClass("disabledbutton");
    }, 100);


    return false;
}



function javiGresku(greska, text)
{

    text.parentElement.className = "error-msg";
    text.innerText = greska;


    var divZaGif = document.getElementById("loadingGif");
    divZaGif.parentNode.removeChild(divZaGif);


    setTimeout(function()
    {
        //$(".submitterCont .submitter.submit").attr("onclick", onclick="validateAndSubmit('rezervacijaTermina', 'informacije', 'infoText')");
        $(".submitterCont .submitter").css("cursor", "pointer");
        $(".submitterCont .submitter").removeClass("disabledbutton");
    }, 500);


    return false;
}

function javiGreskuLogina(greska, text)
{


    var divZaGif = document.getElementById("loadingGif");
    divZaGif.parentNode.removeChild(divZaGif);


    text.parentElement.className = "error-msg";
    text.innerText = greska;


    //$(".submitterCont .submitter").attr("onclick", onclick="validateAndSubmitLogin('loginClanova', 'informacije', 'infoText')");
    $(".submitterCont .submitter").css("cursor", "pointer");
    $(".submitterCont .submitter").removeClass("disabledbutton");


    return false;
}

function javiGreskuUnosaMailaZaResetLozinke(greska, text)
{

    text.parentElement.className = "error-msg";
    text.innerText = greska;


    var divZaGif = document.getElementById("loadingGif");
    divZaGif.parentNode.removeChild(divZaGif);


    setTimeout(function()
    {
        //$(".submitterCont .submitter").attr("onclick", onclick="validateAndSubmitPasswordResetEmailEntry('zaboravljenaLozinka', 'informacije', 'infoText')");
        $(".submitterCont .submitter").css("cursor", "pointer");
        $(".submitterCont .submitter").removeClass("disabledbutton");
        //$(".objava.info").fadeToggle("slow", "linear");
    }, 500);

    return false;
}


function javiGreskuPromjeneLozinke(greska, text)
{

    text.parentElement.className = "error-msg";
    text.innerText = greska;


    var divZaGif = document.getElementById("loadingGif");
    divZaGif.parentNode.removeChild(divZaGif);


    setTimeout(function()
    {
        //$(".submitterCont .submitter.submit").attr("onclick", onclick="validateAndSubmitPasswdChange('promjenaLozinke', 'informacije', 'infoText')");
        $(".submitterCont .submitter").css("cursor", "pointer");
        $(".submitterCont .submitter").removeClass("disabledbutton");
    }, 500);
    return false;
}

function javiGreskuUnosaNoveLozinke(greska, text)
{

    text.parentElement.className = "error-msg";
    text.innerText = greska;


    var divZaGif = document.getElementById("loadingGif");
    divZaGif.parentNode.removeChild(divZaGif);


    setTimeout(function()
    {
        //$(".submitterCont .submitter").attr("onclick", onclick="validateAndSubmitPasswdReset('novaLozinka', 'informacije', 'infoText')");
        $(".submitterCont .submitter").css("cursor", "pointer");
        $(".submitterCont .submitter").removeClass("disabledbutton");
    }, 500);
    return false;
}

// Handle the Ajax response

function submitFinished( response ) 

{
    response = $.trim( response );

    if ( response == "success" ) 
    {
        alert ("success");

    }
    else 
    {
		alert(response);

    }
}

