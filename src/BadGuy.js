import Phaser from 'phaser';

export default class BadGuy extends Phaser.GameObjects.PathFollower {
  constructor(scene, path, x, y, name) {
    super(scene, path, x, y, 'badGuy');
    this.setActive(true);
    this.setVisible(true);
    this.hp = 100;
    this.name = name;
  }

  takeDamage(damage) {
    this.hp -= damage
  }
}

Phaser.GameObjects.GameObjectFactory.register('badGuy', function (path, x, y, name, group) {
  const badGuy = new BadGuy(this.scene, path, x, y, name, group);

  group.add(badGuy);

  badGuy.startFollow({
  duration: 15000,
  rotateToPath: true,
  verticalAdjust: true
  });

  this.displayList.add(badGuy);
  this.updateList.add(badGuy);
  }
);