from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.views.generic import RedirectView, TemplateView
from rest_framework.routers import DefaultRouter

from dispenser.views import DispenserViewSet, StoreViewSet, VendingMachineViewSet, react_app, encrypt_rsa

admin.site.site_header = "Coffee Machine Admin"
admin.site.index_title = "Admin"
admin.site.site_title = "Clean Coffee"

# Create a router instance and register the viewset with it
router = DefaultRouter()
router.register(r"stores", StoreViewSet, basename="store")
router.register(
    r"vendingmachines",
    VendingMachineViewSet,
    basename="vendingmachine",
)
# router.register(r"drinks", DrinkViewSet, basename="drink")
router.register(r"dispensers", DispenserViewSet, basename="dispenser")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("api/dispenser/", include("dispenser.urls")),
    path("api/encrypt-rsa/", encrypt_rsa, name="encrypt-rsa"),
    # React app url
    path("", react_app, name="react-app"),
    # Redirect to the React app for all other paths
    path("", RedirectView.as_view(url="/react-app/", permanent=False)),
]

# Add the websocket url to urlpatterns
# websocket_urlpatterns = [path("ws/background_tasks/", BackgroundTaskConsumer.as_asgi())]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
