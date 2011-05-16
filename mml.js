(function(jQuery) {

    $(document).ready(function() {

        var html_ns = document.body.namespaceURI,
            mml_ns = "http://www.w3.org/1998/Math/MathML";

        window.mml_ns    = mml_ns;
        document.html_ns = html_ns;
        document.mml_ns  = mml_ns;

        document._idhash           = {};
        document._idhash[html_ns]  = {};
        document._idhash[mml_ns]   = {};

        if(document.all !== undefined) {
            for (var i = 0; i < document.all.length; i++) {
                var el = document.all[i],
                    id = el.attributes.id,
                    ns = el.namespaceURI;

                if(id && ns) {
                    document._idhash[ns][id.nodeValue] = el;
                }
            }
        }

    });

    document.getElementByIdNS = function(selector, namespace) {

        // Firefox
        if(this.all === undefined) {
            // Firefox getElementById is happy searching across
            // all namespaces.
            var matched = this.getElementById(selector);

            if(matched && matched.namespaceURI == namespace) {
                return matched;
            }

        } else {

            // Webkit, Opera
            if(namespace == this.body.namespaceURI) {
                return this.getElementById(selector);
            } else {
                return this._idhash[namespace][selector];
            }

        }

    };

    document._getElementById = function(selector) {
        return document.getElementByIdNS(selector,document.mml_ns) || 
               document.getElementByIdNS(selector,document.html_ns);
    };

    document.getAllById = document._getElementById;

    convertMath = function (node) {
       try {
         if (node.nodeType == 1) {

           var newnode = document.createElementNS(mml_ns, node.nodeName.toLowerCase());

           for (var i=0; i < node.attributes.length; i++) {
             newnode.setAttribute(node.attributes[i].nodeName, node.attributes[i].nodeValue);
           }

           for (var j=0; j<node.childNodes.length; i++) {
             var st = node.childNodes[j].nodeValue;
             if (st === null || st.slice(0,1)!=" " && st.slice(0,1)!="\n") {
                 newnode.appendChild(this.convertMath(node.childNodes[j]));
             }
           }
          return newnode;
        } else {
          return node;
        }
       // Catch parse Errors
       } catch(e) {}
    };


    Object.fromXML = function(source, includeRoot)
    {
        if (typeof source=='string')
        {
            try
            {
                if (window.DOMParser)
                    source=(new DOMParser()).parseFromString(source, "application/xml");
                else if (window.ActiveXObject)
                {
                    var xmlObject=new ActiveXObject("Microsoft.XMLDOM");
                    xmlObject.async=false;
                    xmlObject.loadXML(source);
                    source=xmlObject;
                    xmlObject=undefined;
                }
                else
                    throw new Error("Cannot find an XML parser!");
            }
            catch(error)
            {
                return false;
            }
        }
        var result={};
        if (source.nodeType==9)
            source=source.firstChild;
        if (!includeRoot)
            source=source.firstChild;

        while (source) 
        {
            if (source.childNodes.length) 
            {
                if (source.tagName in result) 
                {
                    if (result[source.tagName].constructor != Array) 
                        result[source.tagName] = [result[source.tagName]];
                    result[source.tagName].push(Object.fromXML(source));
                }
                else 
                    result[source.tagName] = Object.fromXML(source);
            }
            else if (source.tagName)
                result[source.tagName] = source.nodeValue;
            else if (!source.nextSibling)
                result = source.nodeValue;
            source = source.nextSibling;
        }

        return result;
    };


}).call(jQuery);
