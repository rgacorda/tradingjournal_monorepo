const permissions = {
  // free: [
  //   'read:public',
  //   'create:trade', 'read:trade', 'update:trade', 'delete:trade',
  //   'read:plan',
  // ],
  paid: [
    "read:public",
    "read:paid",
    "create:import",
    "create:trade",
    "read:trade",
    "update:trade",
    "delete:trade",
    "create:plan",
    "update:plan",
    "delete:plan",
    "create:mistake",
    "update:mistake",
    "delete:mistake",
  ],
};

module.exports = permissions;
