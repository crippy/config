module.exports = {
  register: (req, res) => {
    res.json({ id: 1, name: 'Jacker Reacher' });
  },
  viewOne: function(req, res) {
    console.log('Viewing ' + req.params.id);
  },
  create: function(req, res) {
    console.log('Todo created');
  },
  destroy: function(req, res) {
    console.log('Todo deleted');
  },
  edit: function(req, res) {
    console.log('Todo ' + req.params.id + ' updated');
  }
};
