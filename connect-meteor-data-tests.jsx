getInnerHtml = function (elem) {
  // clean up elem.innerHTML and strip data-reactid attributes too
  return canonicalizeHtml(elem.innerHTML).replace(/ data-reactid=".*?"/g, '');
};

Tinytest.add('react-meteor-data - basic track', function (test) {
  var div = document.createElement("DIV");

  var x = new ReactiveVar('aaa');

  var Foo = React.createClass({
    render() {
      return <span>{this.props.x}</span>;
    }
  });

  var MeteorizedFoo = MeteorizeReactComponent(function() {
    return {
      x: x.get()
    }
  })(Foo);

  React.render(<MeteorizedFoo />, div);
  test.equal(getInnerHtml(div), '<span>aaa</span>');

  x.set('bbb');
  Tracker.flush({_throwFirstError: true});
  test.equal(getInnerHtml(div), '<span>bbb</span>');

  test.equal(x._numListeners(), 1);

  React.unmountComponentAtNode(div);

  test.equal(x._numListeners(), 0);
});

Tinytest.add('react-meteor-data - track based on props', function (test) {
  var div = document.createElement("DIV");

  var xs = [new ReactiveVar('aaa'),
            new ReactiveVar('bbb'),
            new ReactiveVar('ccc')];

  var Foo = React.createClass({
    render() {
      return <span>{this.props.x}</span>;
    }
  });

  var MeteorizedFoo = MeteorizeReactComponent(function(props) {
    return {
      x: xs[props.n].get()
    };
  })(Foo);

  var comp = React.render(<MeteorizedFoo n={0}/>, div);

  test.equal(getInnerHtml(div), '<span>aaa</span>');
  xs[0].set('AAA');
  test.equal(getInnerHtml(div), '<span>aaa</span>');
  Tracker.flush({_throwFirstError: true});
  test.equal(getInnerHtml(div), '<span>AAA</span>');

  {
    let comp2 = React.render(<MeteorizedFoo n={1}/>, div);
    test.isTrue(comp === comp2);
  }

  test.equal(getInnerHtml(div), '<span>bbb</span>');
  xs[1].set('BBB');
  Tracker.flush({_throwFirstError: true});
  test.equal(getInnerHtml(div), '<span>BBB</span>');

  React.render(<MeteorizedFoo n={2}/>, div);
  test.equal(getInnerHtml(div), '<span>ccc</span>');
  xs[2].set('CCC');
  Tracker.flush({_throwFirstError: true});
  test.equal(getInnerHtml(div), '<span>CCC</span>');

  React.render(<MeteorizedFoo n={0}/>, div);
  test.equal(getInnerHtml(div), '<span>AAA</span>');

  React.unmountComponentAtNode(div);
});

Tinytest.add('react-meteor-data - track based on props and context', function (test) {
  var div = document.createElement("DIV");

  var x = new ReactiveVar('aaa');

  var Foo = React.createClass({
    render() {
      return (
        <span><span>{this.props.x}</span><span>{this.props.y}</span></span>
      );
    }
  });

  var MeteorizedFoo = MeteorizeReactComponent(function(props, context) {
    return {
      y: context.x,
      x: x.get()
    }
  })(Foo);

  MeteorizedFoo.contextTypes = {
    x: React.PropTypes.string
  };

  var Bar = React.createClass({
    childContextTypes: {
      x: React.PropTypes.string
    },

    getChildContext() {
      return {
        x: 'bbb'
      }
    },

    render() {
      return (
        <MeteorizedFoo />
      )
    }
  });

  React.render((<Bar />), div);
  test.equal(getInnerHtml(div), '<span><span>aaa</span><span>bbb</span></span>');
  x.set('CCC');
  Tracker.flush({_throwFirstError: true});
  test.equal(getInnerHtml(div), '<span><span>CCC</span><span>bbb</span></span>');
  React.unmountComponentAtNode(div);

  test.equal(x._numListeners(), 0);
});
