{
  "call_to_action": [

  ],
  "date": "2017-09-26T13:25:52-06:00",
  "title": "Ser un voluntario",
  "url": "/es/voluntario"
}
# Ser un voluntario

Empieza a escribir historias,  toma fotos para nosotros, entrevista, traduce o dale mantenimiento a nuestro sitio web llenando el siguiente formulario. Apreciamos que te tomaras el tiempo para contactarnos. Trataremos de contestarte tan pronto como podamos para decirte cómo puedes ayudar.

{{% form-two-column POST "https://formspree.io/humansofnosara@gmail.com" true %}}
<div class="form-two-column__field">{{< field "Correo Electrónico" email email field-email true >}}</div>
<div class="form-two-column__field">{{< field "Confirmación del Correo Electrónico" email email-confirm field-email-confirm true >}}</div>
<div class="form-two-column__field">{{< field "Nombre" text first-name field-first-name true >}}</div>
<div class="form-two-column__field">{{< field "Apellido" text last-name field-last-name true >}}</div>
<div class="form-two-column__field">{{< field "Número de teléfono" tel phone field-phone true >}}</div>
<div class="form-two-column__field">{{< field "Oficio (ej. fotógrafo)" text role field-role true >}}</div>
{{< field-hidden _next "//www.humansofnosara.org/es/" >}}
{{< field-hidden _language es >}}
{{< field-hidden _gotcha "" >}}
{{< field-hidden _subject "Volunteer Application - Humans of Nosara" >}}
<div class="form-two-column__submit">{{< submit "Enviar" >}}</div>
{{% /form-two-column %}}