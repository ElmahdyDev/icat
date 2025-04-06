export default function setupSwipeNavigation(router) {
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 100; // Minimum distance required for a swipe
    
    document.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    document.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
    
function handleSwipe() {
  const swipeDistance = touchEndX - touchStartX;
  if (Math.abs(swipeDistance) < minSwipeDistance) return;
  
  const routes = router.getRoutes();
  const currentRoute = router.currentRoute.value;
  const currentIndex = routes.findIndex(route => route.path === currentRoute.path);
  
  if (swipeDistance > 0 && currentIndex > 0) {
    window.dispatchEvent(new Event('swipe-right'));
    const prevRoute = routes[currentIndex - 1];
    router.push(prevRoute.path);
  }
  
  if (swipeDistance < 0 && currentIndex < routes.length - 1) {
    window.dispatchEvent(new Event('swipe-left'));
    const nextRoute = routes[currentIndex + 1];
    router.push(nextRoute.path);
    }
  }
}