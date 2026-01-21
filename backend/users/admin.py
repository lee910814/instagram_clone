from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


class CustomUserAdmin(UserAdmin):
    #화면에 조일 유저항목들
    list_display = ('username','email','first_name','last_name','is_staff')

    #유저 수정 화면에 보일 항목 설정
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Profile', {
            'fields':('profile_image','short_description'), #보여줄 필드
        }),
    )



admin.site.register(User, CustomUserAdmin)
