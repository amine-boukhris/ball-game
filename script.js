const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.height = innerHeight * .9;
canvas.width = canvas.height * (3/5);

function circleCollision(c1, c2) {
    const distanceBetweenCenters = Math.sqrt( (c1.position.x - c2.position.x)**2 + (c1.position.y - c2.position.y)**2 )
    return distanceBetweenCenters <= c1.radius + c2.radius;
}

function verticalEdgeCollision(circle) {
    return circle.position.y - circle.radius <= 0 || circle.position.y + circle.radius >= canvas.height;
}

function horizontalEdgeCollision(circle) {
    return circle.position.x + circle.radius > canvas.width || circle.position.x - circle.radius <= 0;
}


class Player {
    constructor({position}) {
        this.position = position;
        this.radius = 45;
        this.gapSize = 0.25;
        this.rotation = Math.PI *1.5;
        this.rotationRate = 0.035
    }

    draw() {
        c.save()
        c.translate(this.position.x, this.position.y);
        c.rotate(this.rotation);
        c.translate(-this.position.x, -this.position.y);
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, this.gapSize, 2*Math.PI - this.gapSize);
        c.lineTo(this.position.x, this.position.y)
        c.fillStyle = 'yellow';
        c.fill();
        c.closePath();
        c.restore()
    }

    update() {
        this.draw();
        this.rotation += this.rotationRate
        if (this.rotation >= Math.PI * 2) {
            this.rotation = 0
        }
    }
}

class Ball {
    constructor({position}) {
        this.position = position;
        this.velocity = {
            x: 0,
            y: 0
        }
        this.radius = 45;
        this.rotation = 0;
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, 2*Math.PI);
        c.fillStyle = 'green';
        c.fill();
        c.closePath();
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if (horizontalEdgeCollision(this)) {
            this.velocity.x *= -1;
        }
    }
}

class Shot {
    constructor({position, velocity}) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 30;
        this.rotation = 0;
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, 2*Math.PI);
        c.fillStyle = 'white';
        c.fill();
        c.closePath();
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

const player = new Player({
    position: {
        x: canvas.width/2,
        y: canvas.height-70
    }
})

const ball = new Ball({
    position: {
        x: canvas.width/2,
        y: canvas.height/2
    }
})

const shots = [];

let shootKey = false;

let hasShot = true;



function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    player.update()
    ball.update()

    shots.forEach((shot, index) => {
        shot.update()
        if (verticalEdgeCollision(shot)) {
            shots.splice(index, 1)
        }
        if (horizontalEdgeCollision(shot)) {
            shot.velocity.x *= -1
        }

        if (circleCollision(shot, ball)) {
            console.log("ball collided");
            shots.splice(index, 1)
            const dy = ball.position.y - shot.position.y;
            const dx = ball.position.x - shot.position.x;
            // const distanceBetweenCenters = Math.sqrt( dx**2 + dy**2 );
            const theta = Math.atan2(dy, dx);
            const contactPointX = ball.position.x - ball.radius * Math.cos(theta);
            const contactPointY = ball.position.y - ball.radius * Math.sin(theta);
            const vectorX = contactPointX - ball.position.x;
            const vectorY = contactPointY - ball.position.y;
            const scaleDownRate = .01
            ball.velocity.x += -vectorX * scaleDownRate;
            ball.velocity.y += -vectorY * scaleDownRate;
        }
    })

    if (player.rotation < Math.PI/2 + 0.03 && player.rotation > Math.PI/2 - 0.03) {
        hasShot = true;
    }

    if (shootKey && hasShot) {
        const velocityScaleRate = 6.5;
        shots.push(new Shot({
            position: {
                x: player.position.x + Math.cos(player.rotation) * (player.radius + 5),
                y: player.position.y + Math.sin(player.rotation) * (player.radius + 5)
            },
            velocity: {
                x: Math.cos(player.rotation) * velocityScaleRate,
                y: Math.sin(player.rotation) * velocityScaleRate
            }
        }))
        hasShot = false
    }

}


animate()



window.addEventListener('keydown', (e) => {
    if (e.key === 'f') {
        shootKey = true;
    }
})

window.addEventListener('keyup', (e) => {
    if (e.key === 'f') {
        shootKey = false;
    }
})