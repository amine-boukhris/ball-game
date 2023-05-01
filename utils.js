function circleCollision(c1, c2) {
    const distanceBetweenCenters = Math.sqrt( (c1.position.x - c1.position.x)**2 + (c1.position.y - c2.position.y)**2 )
    return distanceBetweenCenters <= c1.radius + c2.radius;
}

function verticalEdgeCollision(circle) {
    return circle.position.y - circle.radius <= 0 || circle.position.y + circle.radius >= canvas.height;
}

function horizontalEdgeCollision(circle) {
    return circle.position.x + circle.radius > canvas.width || circle.position.x - circle.radius <= 0;
}
