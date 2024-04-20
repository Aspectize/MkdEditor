/// <reference path="S:\Delivery\Aspectize.core\AspectizeIntellisense.js" />

Aspectize.Extend('MkdEditor', {
    Properties: { MkdText: '', EditMode: false, Placeholder: '' },
    Events: ['OnMkdTextChanged'],


    Init: function (elem) {

        function buildMDE(editMode, markDown) {

            var config = {
                element: elem,
                placeholder: Aspectize.UiExtensions.GetProperty(elem, 'Placeholder'),
                spellChecker: false,
                autofocus: editMode,
                toolbar: editMode ? ["bold", "italic", "strikethrough"] : false,
                status: false
            };

            var mde = new SimpleMDE(config);

            mde.value(markDown);

            if (!editMode) mde.togglePreview();

            mde.codemirror.on("change", function (e, arg) {

                var mkdText = elem.aasMdeObj.value();
                Aspectize.UiExtensions.ChangeProperty(elem, 'MkdText', mkdText);
            });

            return mde;
        }

        var mdeObj = elem.aasMdeObj || null;

        if (mdeObj === null) {

            elem.aasMdeObj = buildMDE(false, '');

            elem.aasControlInfo.TogglePreview = function () {

                var mdeObj = elem.aasMdeObj;

                var eMode = Aspectize.UiExtensions.GetProperty(elem, 'EditMode');
                Aspectize.UiExtensions.ChangeProperty(elem, 'EditMode', !eMode);

                var currenMarkDown = mdeObj.value();
                mdeObj.codemirror.off("change");
                mdeObj.toTextArea();
                delete elem.aasMdeObj;
                elem.aasMdeObj = buildMDE(!eMode, currenMarkDown);
            };

            Aspectize.UiExtensions.AddMergedPropertyChangeObserver(elem, function (sender, arg) {

                var mdeObj = elem.aasMdeObj;
                var eMode = Aspectize.UiExtensions.GetProperty(elem, 'EditMode');

                if ('MkdText' in arg) {
                    mdeObj.value(arg.MkdText || '');
                    if (!eMode) {
                        mdeObj.togglePreview();
                        mdeObj.togglePreview();
                    }
                }

                if (('EditMode' in arg) || ('Placeholder' in arg)) {

                    var currenMarkDown = mdeObj.value() || '';
                    mdeObj.codemirror.off("change");
                    mdeObj.toTextArea();
                    elem.aasMdeObj = null;
                    delete elem.aasMdeObj;
                    setTimeout(function () { // Pour Eviter le scroll sur focus

                        elem.aasMdeObj = buildMDE(eMode, currenMarkDown);

                    }, 0);
                }

            });
        }

    }
});


