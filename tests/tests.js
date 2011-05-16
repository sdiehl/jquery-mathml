$(document).ready(function() {

    module("mml.js");

    // cids assigned by Backbone are unique per session, and we
    // can use them to avoid the fact that jsDump fails for
    // circular references in the Node/Tree classes
    var eq = function(a, b, msg) {
        return ok(a.cid == b.cid, msg);
    };

    var html_ns = document.body.namespaceURI;

    test("Init", function() {
        ok(document._idhash,'idhash generated');
        ok(window.mml_ns,'MathML Namespace ref');

        ok(document.getElementByIdNS('el1',html_ns),'lookup in HTML namespace');
        ok(document.getElementByIdNS('el2',mml_ns),'lookup in MathML namespace');
        ok(!document.getElementByIdNS('el1',mml_ns),'no cross between namespaces');
        ok(!document.getElementByIdNS('el2',html_ns),'no cross between namespaces');
        ok(!document.getElementByIdNS('el1',mml_ns),'no cross between namespaces');
        ok(!document.getElementByIdNS('el2',html_ns),'no cross between namespaces');
        ok(document._getElementById('el1'),'cross namespace lookup');
        ok(document._getElementById('el1'),'cross namespace lookup');
        ok(document._getElementById('el2'),'cross namespace lookup');
        ok(document._getElementById('el3'),'cross namespace lookup');

    });

});
