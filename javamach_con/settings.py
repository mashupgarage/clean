import os

from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Ensure No Caching Issues: Restart development server or IDE to clear any cached environment variables.
# Print all environment variables
# print(os.environ)

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get("DEBUG").lower() == "true"
print(f"DEBUG: {DEBUG}")

ALLOWED_HOSTS = ["*"]


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # External
    "rest_framework",
    "corsheaders",  # CORS
    # Internal
    "dispenser",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",  # CORS
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "javamach_con.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        # Add the path to the React app's build directory
        "DIRS": [os.path.join(BASE_DIR, "react-javamach/dist")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "javamach_con.wsgi.application"


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = "/static/"

# Define the directory where static files should be collected during production
# ⭐Run `python manage.py collectstatic` to collect static files
STATIC_ROOT = os.path.join(BASE_DIR, "static")

STATICFILES_DIRS = [
    # Add the path to the React app's static assets directory
    os.path.join(BASE_DIR, "react-javamach/dist/assets"),
    # os.path.join(BASE_DIR, "react-javamach/dist/images"),
]

MEDIA_ROOT = os.path.join(BASE_DIR, "media")  # Path to media folder
MEDIA_URL = "media/"  # URL to media folder

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

REST_FRAMEWORK = {
    # Workaround for "CSRF Failed: CSRF token missing or incorrect"⁉️ error
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.BasicAuthentication",
    ],
}

# CORS settings
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# CELERY_BROKER_URL = "redis://127.0.0.1:6379/0"
# CELERY_RESULT_BACKEND = "redis://127.0.0.1:6379/0"
# CELERY_ACCEPT_CONTENT = ["json"]
# CELERY_TASK_SERIALIZER = "json"
# CELERY_RESULT_SERIALIZER = "json"
# CELERY_TIMEZONE = "Asia/Hong_Kong"  # Set timezone according to your location


LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {message}",
            "style": "{",
        },
        "simple": {"format": "%(levelname)s %(message)s"},
    },
    "handlers": {
        "null": {  # NullHandler to suppress log messages
            "level": "DEBUG",
            "class": "logging.NullHandler",
        },
        # "file": {
        #     "level": "INFO",  # Set the log level as needed
        #     # "level": "ERROR",
        #     "class": "logging.FileHandler",
        #     "filename": "./logfile.log",  # Replace with the actual log file path
        #     "formatter": "verbose",
        # },
    },
    "loggers": {
        "": {
            "handlers": ["null"],  # Suppress log messages
            "level": "DEBUG",  # Ensure this level is equal to or higher than the lowest log level used in your project
            "propagate": False,
        },
        # "": {
        #     "handlers": ["file"],
        #     "level": "INFO",  # Set the log level as needed
        #     "propagate": True,
        # },
    },
}

# Django parameters
DISPENSER_EMULATED = os.getenv("DISPENSER_EMULATION", "False").lower() == "true"
# DISPENSER_EMULATED = False
CLOUD_SERVER_URL = os.environ.get("CLOUD_SERVER_URL", "http://127.0.0.1:8080")
POST_NOTIFICATIONS = os.getenv("POST_NOTIFICATIONS", "True").lower() == "true"
NOTIFICATION_ENDPOINT = f"{CLOUD_SERVER_URL}/api/notifications/"
TRANSACTION_ENDPOINT = f"{CLOUD_SERVER_URL}/api/transactions/"

print(f"DISPENSER_EMULATED: {DISPENSER_EMULATED}")
print(f"POST_NOTIFICATIONS: {POST_NOTIFICATIONS}")
print(f"NOTIFICATION_ENDPOINT: {NOTIFICATION_ENDPOINT}")
print(f"TRANSACTION_ENDPOINT: {TRANSACTION_ENDPOINT}")

# React parameters
REACT_CONFIG = {
    "TIMEOUT_VALUES": {
        "PLACE_CUP_TIMEOUT": int(os.getenv("PLACE_CUP_TIMEOUT")),
        "CHOOSE_SIZE_TIMEOUT": int(os.getenv("CHOOSE_SIZE_TIMEOUT")),
        "DISPENSING_INCOMPLETE_CUP_REMOVE_TIMEOUT": int(os.getenv("DISPENSING_INCOMPLETE_CUP_REMOVE_TIMEOUT")),
        "DISPENSING_COMPLETE_CUP_REMOVE_TIMEOUT": int(os.getenv("DISPENSING_COMPLETE_CUP_REMOVE_TIMEOUT")),
        "PAYMENT_WAITING_TIMEOUT": int(os.getenv("PAYMENT_WAITING_TIMEOUT")),
    },
    "INTERVAL_VALUES": {
        "MENU_UPDATE_INTERVAL": int(os.getenv("MENU_UPDATE_INTERVAL")),
        "APP_STYLE_UPDATE_INTERVAL": int(os.getenv("APP_STYLE_UPDATE_INTERVAL")),
        "PERIODIC_TASK_INTERVAL": int(os.getenv("PERIODIC_TASK_INTERVAL")),
        "PLACE_CUP_TIME_INTERVAL": int(os.getenv("PLACE_CUP_TIME_INTERVAL")),
        "DISPENSING_CHK_CUP_TIME_INTERVAL": int(os.getenv("DISPENSING_CHK_CUP_TIME_INTERVAL")),
        "LOCK_STATE_CHECK_INTERVAL": int(os.getenv("LOCK_STATE_CHECK_INTERVAL")),
    },
    "PAYMENT_SKIP_PAYMENT": os.getenv("PAYMENT_SKIP_PAYMENT") == "true",
    "PAYMENT_ALIPAY_IS_AVAILABLE": os.getenv("PAYMENT_ALIPAY_IS_AVAILABLE") == "false",
    "IS_UPDATING_STYLES": os.getenv("IS_UPDATING_STYLES") == "true",
    "IS_UPDATING_MENU": os.getenv("IS_UPDATING_MENU") == "true",
    "IS_CALLING_PERIODIC_TASK": os.getenv("IS_CALLING_PERIODIC_TASK") == "true",
    "IS_CHECKING_LOCK_STATE": os.getenv("IS_CHECKING_LOCK_STATE") == "true",
    "IS_IGNORING_PIN": os.getenv("IS_IGNORING_PIN") == "false",
    "IS_CHECKING_CUP_BEFORE_COMPLETION": os.getenv("IS_CHECKING_CUP_BEFORE_COMPLETION") == "true",
}

print(f"\nREACT_CONFIG: {REACT_CONFIG}\n")
