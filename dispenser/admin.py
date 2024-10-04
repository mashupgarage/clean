from django.contrib import admin
from django.contrib.auth.models import Group, User

from dispenser.models import Dispenser, Store, VendingMachine

# admin.site.register(Drink)
admin.site.register(Store)
admin.site.register(VendingMachine)

admin.site.register(Dispenser)
# @admin.register(Dispenser)
# class DispenserAdmin(admin.ModelAdmin):
#     readonly_fields = [
#         "temperature",
#         "thermos_weight",
#         "cup_status",
#     ]


# Unregister the User and Group models to disable the Authentication section in the admin panel
admin.site.unregister(User)
admin.site.unregister(Group)
